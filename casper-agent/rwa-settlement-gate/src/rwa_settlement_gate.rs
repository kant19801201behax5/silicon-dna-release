use odra::prelude::*;

#[odra::odra_error]
pub enum Error {
    NotPublisher = 1,
}

/// On-chain settlement gate for tokenized real-world assets (RWA) on Casper.
///
/// This turns the Phoenix Zero MCP tool `get_rwa_settlement_signal` (read-only,
/// off-chain) into something an RWA contract can actually call cross-contract
/// before settling — not just something an off-chain agent reads. The verdict
/// combines two things an RWA settlement decision needs: (a) whether the chain
/// environment is stable enough to settle without a failed/expensive retry,
/// and (b) whether the identity-screening layer (Silicon DNA's ban-list gate
/// on the paid oracle) is currently active. Both must be true.
#[odra::module(errors = Error)]
pub struct RwaSettlementGate {
    publisher: Var<Address>,
    network_safe: Var<bool>,
    identity_screening_active: Var<bool>,
    last_update_ts: Var<u64>,
}

#[odra::module]
impl RwaSettlementGate {
    pub fn init(&mut self) {
        self.publisher.set(self.env().caller());
        self.network_safe.set(false);
        self.identity_screening_active.set(false);
        self.last_update_ts.set(0);
    }

    /// Authorized publisher (the off-chain Phoenix Zero agent) pushes the
    /// latest verdict — same authorized-caller pattern as the existing
    /// SequencerOracle's `update()`.
    pub fn publish(&mut self, network_safe: bool, identity_screening_active: bool, timestamp: u64) {
        if self.publisher.get() != Some(self.env().caller()) {
            self.env().revert(Error::NotPublisher);
        }
        self.network_safe.set(network_safe);
        self.identity_screening_active.set(identity_screening_active);
        self.last_update_ts.set(timestamp);
    }

    /// Primary entrypoint: any RWA contract on Casper calls this before
    /// settling. True only if both signals are true.
    pub fn is_settlement_allowed(&self) -> bool {
        self.network_safe.get_or_default() && self.identity_screening_active.get_or_default()
    }

    pub fn get_network_safe(&self) -> bool {
        self.network_safe.get_or_default()
    }

    pub fn get_identity_screening_active(&self) -> bool {
        self.identity_screening_active.get_or_default()
    }

    pub fn get_last_update_ts(&self) -> u64 {
        self.last_update_ts.get_or_default()
    }
}

#[cfg(test)]
mod tests {
    use crate::rwa_settlement_gate::RwaSettlementGate;
    use odra::host::{Deployer, NoArgs};

    #[test]
    fn deploys_closed_by_default() {
        let env = odra_test::env();
        let contract = RwaSettlementGate::deploy(&env, NoArgs);
        assert!(!contract.is_settlement_allowed());
    }

    #[test]
    fn publisher_can_publish_and_gate_opens() {
        let env = odra_test::env();
        let mut contract = RwaSettlementGate::deploy(&env, NoArgs);
        contract.publish(true, true, 1_753_000_000);
        assert!(contract.is_settlement_allowed());
        assert!(contract.get_network_safe());
        assert!(contract.get_identity_screening_active());
        assert_eq!(contract.get_last_update_ts(), 1_753_000_000);
    }

    #[test]
    fn gate_closes_if_either_signal_is_false() {
        let env = odra_test::env();
        let mut contract = RwaSettlementGate::deploy(&env, NoArgs);
        contract.publish(true, false, 1);
        assert!(!contract.is_settlement_allowed());
        contract.publish(false, true, 2);
        assert!(!contract.is_settlement_allowed());
    }
}
