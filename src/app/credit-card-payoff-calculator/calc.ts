// Credit card payoff logic — multiple cards, issuer-style minimum-payment
// formulas, and the two classic payoff strategies (avalanche: highest APR
// first; snowball: smallest balance first) on one constant monthly budget.
// Pure functions, no React, unit-testable.

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const clean = (n: number): number => (Number.isFinite(n) ? n : 0);

export type MinRule = "interestPlus1" | "interestPlus2" | "pct2" | "pct3" | "fixed";

export const MIN_RULES: { key: MinRule; label: string; detail: string }[] = [
  { key: "interestPlus1", label: "Interest + 1% of balance", detail: "The most common big-issuer formula (floor $25)." },
  { key: "interestPlus2", label: "Interest + 2% of balance", detail: "Used by some issuers; pays down noticeably faster (floor $25)." },
  { key: "pct2", label: "2% of balance", detail: "Older flat-percentage formula (floor $15)." },
  { key: "pct3", label: "3% of balance", detail: "Flat-percentage formula used by some credit unions (floor $15)." },
  { key: "fixed", label: "Fixed payment I choose", detail: "You pay the same amount every month until the card is gone." },
];

/** One month's minimum payment for a card at its current balance.
 *  Never more than balance + this month's interest. */
export function minPaymentFor(
  balance: number,
  aprPct: number,
  rule: MinRule,
  fixedPayment = 0,
): number {
  const bal = Math.max(0, clean(balance));
  if (bal === 0) return 0;
  const interest = (bal * Math.max(0, clean(aprPct))) / 1200;
  let pmt: number;
  switch (rule) {
    case "interestPlus1":
      pmt = Math.max(25, interest + bal * 0.01);
      break;
    case "interestPlus2":
      pmt = Math.max(25, interest + bal * 0.02);
      break;
    case "pct2":
      pmt = Math.max(15, bal * 0.02);
      break;
    case "pct3":
      pmt = Math.max(15, bal * 0.03);
      break;
    case "fixed":
      pmt = Math.max(0, clean(fixedPayment));
      break;
  }
  return round2(Math.min(pmt, bal + interest));
}

export interface CardInput {
  name: string;
  balance: number;
  aprPct: number;
  rule: MinRule;
  fixedPayment?: number;
}

export type Strategy = "avalanche" | "snowball" | "minimums";

export interface PayoffOrderEntry {
  name: string;
  month: number;
}

export interface PayoffSimResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  /** Constant monthly outlay used (initial minimums + extra). */
  monthlyBudget: number;
  order: PayoffOrderEntry[];
  neverPaysOff: boolean;
}

const MAX_MONTHS = 1200;

/** Simulate month by month. With avalanche/snowball the total monthly
 *  outlay stays constant: when a card dies, its payment rolls into the
 *  target card. With "minimums" every card pays only its own minimum. */
export function simulatePayoff(
  cards: CardInput[],
  extraMonthly: number,
  strategy: Strategy,
): PayoffSimResult {
  const state = cards
    .map((c) => ({
      name: c.name,
      balance: Math.max(0, clean(c.balance)),
      aprPct: Math.max(0, clean(c.aprPct)),
      rule: c.rule,
      fixedPayment: c.fixedPayment ?? 0,
    }))
    .filter((c) => c.balance > 0);

  if (state.length === 0) {
    return { months: 0, totalInterest: 0, totalPaid: 0, monthlyBudget: 0, order: [], neverPaysOff: false };
  }

  const initialMinimums = state.reduce(
    (s, c) => s + minPaymentFor(c.balance, c.aprPct, c.rule, c.fixedPayment),
    0,
  );
  const budget =
    strategy === "minimums"
      ? initialMinimums
      : round2(initialMinimums + Math.max(0, clean(extraMonthly)));

  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;
  const order: PayoffOrderEntry[] = [];
  const paidOff = new Set<number>();

  while (state.some((c) => c.balance > 0) && month < MAX_MONTHS) {
    month++;
    // 1. Interest accrues on every live card.
    const interest = state.map((c) => (c.balance * c.aprPct) / 1200);
    interest.forEach((v, i) => {
      totalInterest += v;
      state[i].balance = round2(state[i].balance + v);
    });
    // 2. Minimum payment owed on every live card (computed post-interest on
    //    the pre-interest balance basis issuers use — approximated here with
    //    the balance before interest, matching statement practice).
    const mins = state.map((c, i) =>
      c.balance > 0
        ? minPaymentFor(round2(c.balance - interest[i]), c.aprPct, c.rule, c.fixedPayment)
        : 0,
    );
    // 3. Pay minimums.
    const payments = state.map((c, i) => Math.min(mins[i], c.balance));
    // 4. Roll the leftover budget into the target card.
    if (strategy !== "minimums") {
      let leftover = round2(budget - payments.reduce((s, v) => s + v, 0));
      while (leftover > 0.005) {
        const live = state
          .map((c, i) => ({ c, i }))
          .filter(({ c, i }) => c.balance - payments[i] > 0);
        if (live.length === 0) break;
        live.sort((a, b) =>
          strategy === "avalanche"
            ? b.c.aprPct - a.c.aprPct
            : a.c.balance - payments[a.i] - (b.c.balance - payments[b.i]),
        );
        const t = live[0];
        const add = Math.min(leftover, t.c.balance - payments[t.i]);
        payments[t.i] = round2(payments[t.i] + add);
        leftover = round2(leftover - add);
      }
    }
    // 5. Apply payments.
    state.forEach((c, i) => {
      totalPaid += payments[i];
      c.balance = round2(c.balance - payments[i]);
      if (c.balance <= 0 && !paidOff.has(i)) {
        paidOff.add(i);
        order.push({ name: c.name, month });
      }
    });
  }

  const stuck = state.some((c) => c.balance > 0);
  return {
    months: month,
    totalInterest: round2(totalInterest),
    totalPaid: round2(totalPaid),
    monthlyBudget: budget,
    order,
    neverPaysOff: stuck,
  };
}
