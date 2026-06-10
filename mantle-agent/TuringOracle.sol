// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TuringOracle
 * @notice Publishes Silicon DNA Turing Test verdicts on Mantle.
 *         Any DeFi protocol can call is_legitimate() to verify agent/human traffic.
 *
 * Deployed on: Mantle Sepolia Testnet
 * Address:     0xd394ffae51d8fb52187cf3ae3b014ddc80dc7b15
 * Explorer:    https://sepolia.mantlescan.xyz/address/0xd394ffae51d8fb52187cf3ae3b014ddc80dc7b15
 * Pusher:      mantle_pusher.js (runs on DO NYC1, updates every 60s)
 *
 * Silicon DNA classifies traffic into:
 *   HUMAN        — real user
 *   LEGIT_AGENT  — verified AI agent
 *   MALICIOUS_BOT — dropped at L0
 *
 * trust_score_bps = 0–10000 (basis points, 10000 = 100% human/legit)
 * bot_ratio_bps   = 0–10000 (basis points of bot traffic in last window)
 */
contract TuringOracle {

    struct TuringState {
        bool    human_traffic;      // majority of traffic classified as human/legit
        uint256 trust_score_bps;    // Silicon DNA composite trust [0–10000]
        uint256 bot_ratio_bps;      // bot traffic ratio [0–10000]
        bool    mantle_safe;        // Mantle sequencer healthy (RTT < 500ms, no stall)
        uint256 p99_ms;             // Mantle P99 latency in milliseconds
        uint256 timestamp;          // last update (unix)
        uint256 update_count;       // total on-chain updates
    }

    address public owner;
    TuringState private _state;

    event TuringUpdated(
        bool    human_traffic,
        uint256 trust_score_bps,
        bool    mantle_safe,
        uint256 p99_ms,
        uint256 indexed update_count
    );

    error NotOwner();
    error InvalidScore();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    /**
     * @notice Push latest Silicon DNA Turing verdict on-chain.
     * @param _human_traffic  true if >50% of recent traffic is human/legit
     * @param _trust_bps      composite trust score in basis points [0–10000]
     * @param _bot_ratio_bps  bot traffic fraction in basis points [0–10000]
     * @param _mantle_safe    Mantle sequencer status (RTT P99 < 500ms, no stall)
     * @param _p99_ms         Mantle P99 RTT in milliseconds
     */
    function update(
        bool    _human_traffic,
        uint256 _trust_bps,
        uint256 _bot_ratio_bps,
        bool    _mantle_safe,
        uint256 _p99_ms
    ) external onlyOwner {
        if (_trust_bps > 10_000 || _bot_ratio_bps > 10_000) revert InvalidScore();

        _state = TuringState({
            human_traffic:    _human_traffic,
            trust_score_bps:  _trust_bps,
            bot_ratio_bps:    _bot_ratio_bps,
            mantle_safe:      _mantle_safe,
            p99_ms:           _p99_ms,
            timestamp:        block.timestamp,
            update_count:     _state.update_count + 1
        });

        emit TuringUpdated(_human_traffic, _trust_bps, _mantle_safe, _p99_ms, _state.update_count);
    }

    /**
     * @notice Primary gate: is current traffic legitimate?
     * @return true if human/legit traffic AND Mantle sequencer safe
     */
    function is_legitimate() external view returns (bool) {
        return _state.human_traffic && _state.mantle_safe;
    }

    /**
     * @notice Returns the full Turing state snapshot.
     */
    function get_state() external view returns (TuringState memory) {
        return _state;
    }

    /**
     * @notice Seconds since last on-chain update. Returns max uint256 if never updated.
     */
    function staleness_seconds() external view returns (uint256) {
        if (_state.timestamp == 0) return type(uint256).max;
        return block.timestamp - _state.timestamp;
    }

    /**
     * @notice Transfer ownership to a new address.
     */
    function transfer_ownership(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}
