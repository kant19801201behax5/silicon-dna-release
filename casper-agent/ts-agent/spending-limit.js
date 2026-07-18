/**
 * Daily spending cap for x402 micropayments — smart-account-style guardrail.
 *
 * Casper Manifest initiative #8 (smart accounts for agents) calls for spend
 * limits set by an agent's owner rather than the agent trusting itself.
 * This is that guardrail applied to our own x402 spend: independent of
 * which payment rail is used (Base USDC today, Casper-native x402 once
 * wired in — see x402-casper-pay.js), no more than DAILY_LIMIT_USDC gets
 * spent per UTC day, checked before a payment is attempted, not after.
 */

'use strict';

class SpendingLimiter {
  constructor(dailyLimitUsdc) {
    if (!(dailyLimitUsdc > 0)) {
      throw new Error('dailyLimitUsdc must be a positive number');
    }
    this.dailyLimitUsdc = dailyLimitUsdc;
    this.spentToday = 0;
    this.dayKey = SpendingLimiter._today();
  }

  static _today() {
    return new Date().toISOString().slice(0, 10); // UTC calendar day
  }

  _rollIfNewDay() {
    const today = SpendingLimiter._today();
    if (today !== this.dayKey) {
      this.dayKey = today;
      this.spentToday = 0;
    }
  }

  canSpend(amountUsdc) {
    this._rollIfNewDay();
    return this.spentToday + amountUsdc <= this.dailyLimitUsdc + 1e-9;
  }

  recordSpend(amountUsdc) {
    this._rollIfNewDay();
    if (!this.canSpend(amountUsdc)) {
      throw new Error(
        `spend of $${amountUsdc} would exceed daily cap ($${this.dailyLimitUsdc}, ` +
        `$${this.remaining().toFixed(4)} remaining)`
      );
    }
    this.spentToday += amountUsdc;
  }

  remaining() {
    this._rollIfNewDay();
    return Math.max(0, this.dailyLimitUsdc - this.spentToday);
  }
}

module.exports = { SpendingLimiter };
