// US state minimum auto liability insurance requirements.
// Compiled from published state requirements (Insurance Information
// Institute state summaries), November 2026. Limits are bodily injury
// per person / bodily injury per accident / property damage, in dollars.
// Minimums change — the page tells readers to confirm with their state
// insurance department, and so should anyone editing this table.

export interface StateMinimum {
  code: string;
  name: string;
  /** Bodily injury per person ($). 0 = not required by default (see note). */
  biPerson: number;
  /** Bodily injury per accident ($). */
  biAccident: number;
  /** Property damage ($). */
  pd: number;
  /** No-fault state: PIP is part of the mandatory package. */
  pip: boolean;
  note?: string;
}

export const STATE_MINIMUMS: StateMinimum[] = [
  { code: "AL", name: "Alabama", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "AK", name: "Alaska", biPerson: 50000, biAccident: 100000, pd: 25000, pip: false },
  { code: "AZ", name: "Arizona", biPerson: 25000, biAccident: 50000, pd: 15000, pip: false },
  { code: "AR", name: "Arkansas", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "CA", name: "California", biPerson: 30000, biAccident: 60000, pd: 15000, pip: false, note: "Raised from 15/30/5 on 1 January 2025." },
  { code: "CO", name: "Colorado", biPerson: 25000, biAccident: 50000, pd: 15000, pip: false },
  { code: "CT", name: "Connecticut", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "DE", name: "Delaware", biPerson: 25000, biAccident: 50000, pd: 10000, pip: true },
  { code: "DC", name: "District of Columbia", biPerson: 25000, biAccident: 50000, pd: 10000, pip: false },
  { code: "FL", name: "Florida", biPerson: 0, biAccident: 0, pd: 10000, pip: true, note: "Florida requires $10,000 PIP and $10,000 property damage; bodily-injury liability is not mandatory for most drivers (financial-responsibility rules of 10/20 apply after certain violations or crashes)." },
  { code: "GA", name: "Georgia", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "HI", name: "Hawaii", biPerson: 20000, biAccident: 40000, pd: 10000, pip: true },
  { code: "ID", name: "Idaho", biPerson: 25000, biAccident: 50000, pd: 15000, pip: false },
  { code: "IL", name: "Illinois", biPerson: 25000, biAccident: 50000, pd: 20000, pip: false },
  { code: "IN", name: "Indiana", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "IA", name: "Iowa", biPerson: 20000, biAccident: 40000, pd: 15000, pip: false },
  { code: "KS", name: "Kansas", biPerson: 25000, biAccident: 50000, pd: 25000, pip: true },
  { code: "KY", name: "Kentucky", biPerson: 25000, biAccident: 50000, pd: 25000, pip: true, note: "Choice no-fault: drivers may reject the PIP/tort-limitation package." },
  { code: "LA", name: "Louisiana", biPerson: 15000, biAccident: 30000, pd: 25000, pip: false },
  { code: "ME", name: "Maine", biPerson: 50000, biAccident: 100000, pd: 25000, pip: false },
  { code: "MD", name: "Maryland", biPerson: 30000, biAccident: 60000, pd: 15000, pip: false },
  { code: "MA", name: "Massachusetts", biPerson: 20000, biAccident: 40000, pd: 5000, pip: true },
  { code: "MI", name: "Michigan", biPerson: 50000, biAccident: 100000, pd: 10000, pip: true, note: "Default bodily-injury limit is 250/500; 50/100 is the lowest option and only for eligible drivers (e.g. Medicaid enrollees). PIP medical coverage is chosen separately, including opt-outs for eligible households." },
  { code: "MN", name: "Minnesota", biPerson: 30000, biAccident: 60000, pd: 10000, pip: true },
  { code: "MS", name: "Mississippi", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "MO", name: "Missouri", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "MT", name: "Montana", biPerson: 25000, biAccident: 50000, pd: 20000, pip: false },
  { code: "NE", name: "Nebraska", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "NV", name: "Nevada", biPerson: 25000, biAccident: 50000, pd: 20000, pip: false },
  { code: "NH", name: "New Hampshire", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false, note: "Insurance is not mandatory in New Hampshire, but drivers who buy it — and anyone required to file financial responsibility — must meet 25/50/25." },
  { code: "NJ", name: "New Jersey", biPerson: 35000, biAccident: 70000, pd: 25000, pip: true, note: "Standard-policy minimums rose to 35/70/25 on 1 January 2026. A limited 'Basic' policy with lower limits exists for eligible low-income drivers." },
  { code: "NM", name: "New Mexico", biPerson: 25000, biAccident: 50000, pd: 10000, pip: false },
  { code: "NY", name: "New York", biPerson: 25000, biAccident: 50000, pd: 10000, pip: true },
  { code: "NC", name: "North Carolina", biPerson: 50000, biAccident: 100000, pd: 50000, pip: false, note: "Raised from 30/60/25 on 1 July 2025 — now among the highest minimums in the US." },
  { code: "ND", name: "North Dakota", biPerson: 25000, biAccident: 50000, pd: 25000, pip: true },
  { code: "OH", name: "Ohio", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "OK", name: "Oklahoma", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "OR", name: "Oregon", biPerson: 25000, biAccident: 50000, pd: 20000, pip: true },
  { code: "PA", name: "Pennsylvania", biPerson: 15000, biAccident: 30000, pd: 5000, pip: false, note: "Plus $5,000 first-party medical benefits; drivers choose limited or full tort." },
  { code: "RI", name: "Rhode Island", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "SC", name: "South Carolina", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "SD", name: "South Dakota", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "TN", name: "Tennessee", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "TX", name: "Texas", biPerson: 30000, biAccident: 60000, pd: 25000, pip: false },
  { code: "UT", name: "Utah", biPerson: 30000, biAccident: 65000, pd: 25000, pip: true, note: "Raised on 1 January 2025 from 25/50/15." },
  { code: "VT", name: "Vermont", biPerson: 25000, biAccident: 50000, pd: 10000, pip: false },
  { code: "VA", name: "Virginia", biPerson: 30000, biAccident: 60000, pd: 20000, pip: false, note: "Raised from 25/50/20 on 1 January 2025; insurance itself became mandatory in July 2024 (the old uninsured-motorist fee option ended)." },
  { code: "WA", name: "Washington", biPerson: 25000, biAccident: 50000, pd: 10000, pip: false },
  { code: "WV", name: "West Virginia", biPerson: 25000, biAccident: 50000, pd: 25000, pip: false },
  { code: "WI", name: "Wisconsin", biPerson: 25000, biAccident: 50000, pd: 10000, pip: false },
  { code: "WY", name: "Wyoming", biPerson: 25000, biAccident: 50000, pd: 20000, pip: false },
];
