use odra::prelude::*;

#[odra::odra_error]
pub enum Error {
    NotPublisher = 1,
    NoSamples = 2,
}

/// On-chain oracle reputation registry for Casper.
///
/// Turns "historical accuracy" from a claim into a checkable on-chain
/// number, matching the Casper Agentic Buildathon's own track wording:
/// "RWA Oracle Agents with Verifiable On-Chain Identity ... reputation
/// score based on historical accuracy". The accuracy score is NOT taken on
/// faith from the publisher: the publisher submits raw TP/FP/TN/FN counts
/// (computed off-chain, deterministically, from public telemetry — see
/// reputation_scorer.js) and this contract derives accuracy_bps itself, so
/// a publisher cannot submit a score that doesn't match its own evidence.
///
/// TP/FP/TN/FN follow reputation_scorer.js's methodology exactly: a
/// published verdict (safe/unsafe) is checked against telemetry samples
/// that arrive strictly *after* it, inside a bounded look-ahead window
/// (window_seconds) — so "unsafe" becomes a testable claim about what
/// happens next, not a self-graded snapshot of the same instant.
///
/// Each publish() replaces the previous confusion matrix rather than
/// accumulating into it — the off-chain scorer already decides how much
/// history to fold into one call (see reputation_scorer.js's `maxHistory`),
/// so the contract just stores the latest verdict on that question.
#[odra::module(errors = Error)]
pub struct ReputationRegistry {
    publisher: Var<Address>,
    accuracy_bps: Var<u32>, // 0-10000, derived on-chain from tp/fp/tn/fn
    sample_size: Var<u32>,  // tp+fp+tn+fn behind the current score
    tp: Var<u32>,
    fp: Var<u32>,
    tn: Var<u32>,
    fn_count: Var<u32>,
    window_seconds: Var<u64>, // methodology parameter, published for auditability
    last_update_ts: Var<u64>,
}

#[odra::module]
impl ReputationRegistry {
    pub fn init(&mut self) {
        self.publisher.set(self.env().caller());
        self.accuracy_bps.set(0);
        self.sample_size.set(0);
        self.tp.set(0);
        self.fp.set(0);
        self.tn.set(0);
        self.fn_count.set(0);
        self.window_seconds.set(0);
        self.last_update_ts.set(0);
    }

    /// Authorized publisher pushes a freshly-computed confusion matrix.
    /// accuracy_bps is derived here, not accepted as an input.
    pub fn publish(
        &mut self,
        tp: u32,
        fp: u32,
        tn: u32,
        fn_count: u32,
        window_seconds: u64,
        timestamp: u64,
    ) {
        if self.publisher.get() != Some(self.env().caller()) {
            self.env().revert(Error::NotPublisher);
        }
        // u64 intermediate: avoids overflow on `correct * 10_000` for large
        // (if unlikely) sample counts before narrowing back to bps (<=10000).
        let sample_size: u64 = tp as u64 + fp as u64 + tn as u64 + fn_count as u64;
        if sample_size == 0 {
            self.env().revert(Error::NoSamples);
        }
        let correct: u64 = tp as u64 + tn as u64;
        let accuracy_bps = (correct * 10_000 / sample_size) as u32;

        self.accuracy_bps.set(accuracy_bps);
        self.sample_size.set(sample_size as u32);
        self.tp.set(tp);
        self.fp.set(fp);
        self.tn.set(tn);
        self.fn_count.set(fn_count);
        self.window_seconds.set(window_seconds);
        self.last_update_ts.set(timestamp);
    }

    /// Cross-contract gate hook: does this oracle currently meet a caller's
    /// own bar for both accuracy AND evidence volume? A high score from 3
    /// samples isn't trustworthy the same way a high score from 300 is, so
    /// callers must pick their own sample-size floor rather than accuracy
    /// alone deciding trust.
    pub fn is_trustworthy(&self, min_accuracy_bps: u32, min_sample_size: u32) -> bool {
        self.accuracy_bps.get_or_default() >= min_accuracy_bps
            && self.sample_size.get_or_default() >= min_sample_size
    }

    pub fn get_accuracy_bps(&self) -> u32 {
        self.accuracy_bps.get_or_default()
    }

    pub fn get_sample_size(&self) -> u32 {
        self.sample_size.get_or_default()
    }

    // Four separate getters rather than one tuple-returning getter: Odra's
    // schema/CLTyped derives only cover tuples up to arity 3 (confirmed by
    // compiling this contract against odra-schema 2.9.1 — arity 4 fails
    // `NamedCLTyped`/`SchemaCustomTypes`), so an entry point can't return
    // (u32, u32, u32, u32) directly.
    pub fn get_tp(&self) -> u32 {
        self.tp.get_or_default()
    }

    pub fn get_fp(&self) -> u32 {
        self.fp.get_or_default()
    }

    pub fn get_tn(&self) -> u32 {
        self.tn.get_or_default()
    }

    pub fn get_fn_count(&self) -> u32 {
        self.fn_count.get_or_default()
    }

    pub fn get_window_seconds(&self) -> u64 {
        self.window_seconds.get_or_default()
    }

    pub fn get_last_update_ts(&self) -> u64 {
        self.last_update_ts.get_or_default()
    }
}

#[cfg(test)]
mod tests {
    use crate::reputation_registry::ReputationRegistry;
    use odra::host::{Deployer, NoArgs};

    #[test]
    fn deploys_at_zero_and_untrustworthy() {
        let env = odra_test::env();
        let contract = ReputationRegistry::deploy(&env, NoArgs);
        assert_eq!(contract.get_accuracy_bps(), 0);
        assert_eq!(contract.get_sample_size(), 0);
        assert!(!contract.is_trustworthy(1, 1), "nothing published yet");
    }

    #[test]
    fn publisher_can_publish_and_accuracy_is_derived_correctly() {
        let env = odra_test::env();
        let mut contract = ReputationRegistry::deploy(&env, NoArgs);
        // 3 TP + 1 TN correct out of 5 total (1 FP, 0 FN) -> 4/5 = 8000 bps
        contract.publish(3, 1, 1, 0, 900, 1_755_000_000);
        assert_eq!(contract.get_accuracy_bps(), 8000);
        assert_eq!(contract.get_sample_size(), 5);
        assert_eq!(contract.get_tp(), 3);
        assert_eq!(contract.get_fp(), 1);
        assert_eq!(contract.get_tn(), 1);
        assert_eq!(contract.get_fn_count(), 0);
        assert_eq!(contract.get_window_seconds(), 900);
        assert_eq!(contract.get_last_update_ts(), 1_755_000_000);
    }

    #[test]
    fn perfect_record_is_10000_bps() {
        let env = odra_test::env();
        let mut contract = ReputationRegistry::deploy(&env, NoArgs);
        contract.publish(5, 0, 5, 0, 900, 1);
        assert_eq!(contract.get_accuracy_bps(), 10000);
    }

    #[test]
    fn all_wrong_is_zero_bps() {
        let env = odra_test::env();
        let mut contract = ReputationRegistry::deploy(&env, NoArgs);
        contract.publish(0, 5, 0, 5, 900, 1);
        assert_eq!(contract.get_accuracy_bps(), 0);
    }

    #[test]
    fn uneven_split_rounds_down() {
        // 1 correct out of 3 -> 3333.33... bps, must truncate not round up.
        let env = odra_test::env();
        let mut contract = ReputationRegistry::deploy(&env, NoArgs);
        contract.publish(1, 2, 0, 0, 900, 1);
        assert_eq!(contract.get_accuracy_bps(), 3333);
    }

    #[test]
    #[should_panic]
    fn publish_with_all_zero_counts_reverts() {
        let env = odra_test::env();
        let mut contract = ReputationRegistry::deploy(&env, NoArgs);
        contract.publish(0, 0, 0, 0, 900, 1);
    }

    #[test]
    fn republish_replaces_previous_state_rather_than_accumulating() {
        let env = odra_test::env();
        let mut contract = ReputationRegistry::deploy(&env, NoArgs);
        contract.publish(10, 0, 0, 0, 900, 1); // 100%
        contract.publish(0, 10, 0, 0, 900, 2); // 0%
        assert_eq!(
            contract.get_accuracy_bps(),
            0,
            "latest publish is the current confusion matrix, not blended with the old one"
        );
        assert_eq!(contract.get_sample_size(), 10);
        assert_eq!(contract.get_last_update_ts(), 2);
    }

    #[test]
    fn is_trustworthy_checks_both_accuracy_and_sample_size_floor() {
        let env = odra_test::env();
        let mut contract = ReputationRegistry::deploy(&env, NoArgs);
        contract.publish(9, 1, 0, 0, 900, 1); // 9000 bps, sample_size 10
        assert!(contract.is_trustworthy(8000, 5), "meets both floors");
        assert!(!contract.is_trustworthy(9500, 5), "accuracy floor not met");
        assert!(
            !contract.is_trustworthy(8000, 50),
            "sample-size floor not met -- not enough evidence yet even at high accuracy"
        );
    }

    #[test]
    #[should_panic]
    fn non_publisher_cannot_publish() {
        let env = odra_test::env();
        let mut contract = ReputationRegistry::deploy(&env, NoArgs);
        let attacker = env.get_account(1); // deploy() ran init() as get_account(0)
        env.set_caller(attacker);
        contract.publish(5, 0, 5, 0, 900, 1);
    }
}
