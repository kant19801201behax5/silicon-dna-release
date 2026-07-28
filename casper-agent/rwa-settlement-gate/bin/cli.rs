//! Deploys the `RwaSettlementGate` contract via the odra-cli livenet tooling.
use rwa_settlement_gate::rwa_settlement_gate::RwaSettlementGate;
use odra::host::{HostEnv, NoArgs};
use odra_cli::{deploy::DeployScript, DeployedContractsContainer, DeployerExt, OdraCli};

/// Deploys `RwaSettlementGate` and adds it to the container.
pub struct RwaGateDeployScript;

impl DeployScript for RwaGateDeployScript {
    fn deploy(
        &self,
        env: &HostEnv,
        container: &mut DeployedContractsContainer,
    ) -> Result<(), odra_cli::deploy::Error> {
        let _gate = RwaSettlementGate::load_or_deploy(
            &env,
            NoArgs,
            container,
            500_000_000_000, // 500 CSPR — 200 ran out of gas on the first real attempt (2026-07-28)
        )?;
        Ok(())
    }
}

pub fn main() {
    OdraCli::new()
        .about("CLI tool for rwa_settlement_gate smart contract")
        .deploy(RwaGateDeployScript)
        .contract::<RwaSettlementGate>()
        .build()
        .run();
}
