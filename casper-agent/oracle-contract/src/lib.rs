// Phoenix Zero × Silicon DNA — Sequencer Health Oracle
// Casper 2.0 Smart Contract (casper-contract 5.1.1)
//
// entry points: call() update() is_safe() get_state()

#![no_std]
#![no_main]

extern crate alloc;
use alloc::collections::BTreeMap;

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{
    CLType, CLValue, ApiError, Key, Parameter,
    addressable_entity::{
        EntryPoints, EntityEntryPoint, EntryPointAccess, EntryPointType, EntryPointPayment,
    },
    contracts::NamedKeys,
    contract_messages::MessageTopicOperation,
};

const KEY_SAFE:            &str = "safe";
const KEY_ARB_P99_MS:      &str = "arb_p99_ms";
const KEY_BASE_P99_MS:     &str = "base_p99_ms";
const KEY_ARB_REVERT_BPS:  &str = "arb_revert_bps";
const KEY_BASE_REVERT_BPS: &str = "base_revert_bps";
const KEY_LAST_UPDATE_TS:  &str = "last_update_ts";
const KEY_TOTAL_PUSHES:    &str = "total_pushes";

fn get_uref(name: &str) -> casper_types::URef {
    runtime::get_key(name)
        .unwrap_or_revert_with(ApiError::User(2))
        .into_uref()
        .unwrap_or_revert_with(ApiError::User(3))
}

fn r_bool(k: &str) -> bool { storage::read(get_uref(k)).unwrap_or_revert().unwrap_or(false) }
fn r_u64(k: &str)  -> u64  { storage::read(get_uref(k)).unwrap_or_revert().unwrap_or(0u64) }

#[no_mangle]
pub extern "C" fn update() {
    let safe: bool    = runtime::get_named_arg("safe");
    let arb_p99: u64  = runtime::get_named_arg("arb_p99_ms");
    let base_p99: u64 = runtime::get_named_arg("base_p99_ms");
    let arb_bps: u64  = runtime::get_named_arg("arb_revert_bps");
    let base_bps: u64 = runtime::get_named_arg("base_revert_bps");
    let ts: u64       = runtime::get_named_arg("timestamp");

    storage::write(get_uref(KEY_SAFE),            safe);
    storage::write(get_uref(KEY_ARB_P99_MS),      arb_p99);
    storage::write(get_uref(KEY_BASE_P99_MS),     base_p99);
    storage::write(get_uref(KEY_ARB_REVERT_BPS),  arb_bps);
    storage::write(get_uref(KEY_BASE_REVERT_BPS), base_bps);
    storage::write(get_uref(KEY_LAST_UPDATE_TS),  ts);
    storage::write(get_uref(KEY_TOTAL_PUSHES),    r_u64(KEY_TOTAL_PUSHES) + 1);
}

#[no_mangle]
pub extern "C" fn is_safe() {
    runtime::ret(CLValue::from_t(r_bool(KEY_SAFE)).unwrap_or_revert());
}

#[no_mangle]
pub extern "C" fn get_state() {
    use alloc::format;
    let s = format!(
        r#"{{"safe":{},"arb_p99_ms":{},"base_p99_ms":{},"arb_revert_bps":{},"base_revert_bps":{},"last_update_ts":{},"total_pushes":{}}}"#,
        r_bool(KEY_SAFE), r_u64(KEY_ARB_P99_MS), r_u64(KEY_BASE_P99_MS),
        r_u64(KEY_ARB_REVERT_BPS), r_u64(KEY_BASE_REVERT_BPS),
        r_u64(KEY_LAST_UPDATE_TS), r_u64(KEY_TOTAL_PUSHES),
    );
    runtime::ret(CLValue::from_t(s).unwrap_or_revert());
}

#[no_mangle]
pub extern "C" fn call() {
    let mut nk = NamedKeys::new();
    nk.insert(KEY_SAFE.into(),            Key::URef(storage::new_uref(false)));
    nk.insert(KEY_ARB_P99_MS.into(),      Key::URef(storage::new_uref(0u64)));
    nk.insert(KEY_BASE_P99_MS.into(),     Key::URef(storage::new_uref(0u64)));
    nk.insert(KEY_ARB_REVERT_BPS.into(),  Key::URef(storage::new_uref(0u64)));
    nk.insert(KEY_BASE_REVERT_BPS.into(), Key::URef(storage::new_uref(0u64)));
    nk.insert(KEY_LAST_UPDATE_TS.into(),  Key::URef(storage::new_uref(0u64)));
    nk.insert(KEY_TOTAL_PUSHES.into(),    Key::URef(storage::new_uref(0u64)));

    let mut eps = EntryPoints::new();
    let public  = EntryPointAccess::Public;
    let caller  = EntryPointType::Caller;
    let payment = EntryPointPayment::Caller;

    eps.add_entry_point(EntityEntryPoint::new("update", alloc::vec![
        Parameter::new("safe",            CLType::Bool),
        Parameter::new("arb_p99_ms",      CLType::U64),
        Parameter::new("base_p99_ms",     CLType::U64),
        Parameter::new("arb_revert_bps",  CLType::U64),
        Parameter::new("base_revert_bps", CLType::U64),
        Parameter::new("timestamp",       CLType::U64),
    ], CLType::Unit, public.clone(), caller, payment));

    eps.add_entry_point(EntityEntryPoint::new(
        "is_safe",   alloc::vec![], CLType::Bool,
        public.clone(), EntryPointType::Caller, EntryPointPayment::Caller
    ));
    eps.add_entry_point(EntityEntryPoint::new(
        "get_state", alloc::vec![], CLType::String,
        public, EntryPointType::Caller, EntryPointPayment::Caller
    ));

    let (contract_hash, _) = storage::new_contract(
        eps, Some(nk),
        Some("sequencer_oracle_hash".into()),
        Some("sequencer_oracle_uref".into()),
        None::<BTreeMap<alloc::string::String, MessageTopicOperation>>,
    );

    runtime::put_key("sequencer_oracle", Key::Hash(contract_hash.value()));
}
