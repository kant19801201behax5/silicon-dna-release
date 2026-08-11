//! Deploys the `ReputationRegistry` contract via the odra-cli livenet tooling.
use odra::host::{HostEnv, NoArgs};
use odra_cli::{deploy::DeployScript, DeployedContractsContainer, DeployerExt, OdraCli};
use reputation_registry::reputation_registry::ReputationRegistry;

/// Deploys `ReputationRegistry` and adds it to the container.
pub struct ReputationRegistryDeployScript;

impl DeployScript for ReputationRegistryDeployScript {
    fn deploy(
        &self,
        env: &HostEnv,
        container: &mut DeployedContractsContainer,
    ) -> Result<(), odra_cli::deploy::Error> {
        let _registry = ReputationRegistry::load_or_deploy(
            &env,
            NoArgs,
            container,
            // Same gas budget as RwaSettlementGate's deploy (500 CSPR — 200
            // ran out of gas on that contract's first real attempt,
            // 2026-07-28). Same module shape and complexity, so starting
            // from the same proven figure rather than guessing a smaller one.
            500_000_000_000,
        )?;
        Ok(())
    }
}

pub fn main() {
    OdraCli::new()
        .about("CLI tool for reputation_registry smart contract")
        .deploy(ReputationRegistryDeployScript)
        .contract::<ReputationRegistry>()
        .build()
        .run();
}
