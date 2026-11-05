"use client";

import { useEffect, useMemo, useState } from "react";

const inputCls =
  "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const STORE_KEY = "frinjo-smm-panel-v1";

export interface SmmService { id: number; category: string; name: string; rate: number; min: number; max: number; active: boolean }
export interface SmmUser { name: string; email: string; pass: string; balance: number; role: "user" | "admin" }
export type OrderStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";
export interface SmmOrder { id: number; userEmail: string; serviceId: number; link: string; qty: number; charge: number; status: OrderStatus; createdAt: string; providerRef: string }
export interface FundRequest { id: number; userEmail: string; amount: number; method: string; note: string; status: "Pending" | "Approved" | "Rejected" }
export interface Provider { name: string; apiUrl: string; apiKey: string }
interface DB { users: SmmUser[]; services: SmmService[]; orders: SmmOrder[]; funds: FundRequest[]; provider: Provider }

const SEED_SERVICES: SmmService[] = [
  { id: 1, category: "Instagram", name: "Instagram Followers — Real & Active", rate: 2.5, min: 100, max: 50000, active: true },
  { id: 2, category: "Instagram", name: "Instagram Likes — Instant", rate: 0.8, min: 50, max: 20000, active: true },
  { id: 3, category: "Instagram", name: "Instagram Views — Reels & Video", rate: 0.4, min: 500, max: 100000, active: true },
  { id: 4, category: "YouTube", name: "YouTube Views — High Retention", rate: 1.2, min: 500, max: 200000, active: true },
  { id: 5, category: "YouTube", name: "YouTube Subscribers — Permanent", rate: 12.0, min: 50, max: 10000, active: true },
  { id: 6, category: "YouTube", name: "YouTube Likes", rate: 1.5, min: 50, max: 15000, active: true },
  { id: 7, category: "TikTok", name: "TikTok Followers", rate: 3.2, min: 100, max: 50000, active: true },
  { id: 8, category: "TikTok", name: "TikTok Likes", rate: 0.6, min: 100, max: 100000, active: true },
  { id: 9, category: "TikTok", name: "TikTok Video Views", rate: 0.3, min: 1000, max: 500000, active: true },
  { id: 10, category: "Facebook", name: "Facebook Page Followers", rate: 2.8, min: 100, max: 100000, active: true },
  { id: 11, category: "Facebook", name: "Facebook Post Likes", rate: 0.9, min: 50, max: 20000, active: true },
  { id: 12, category: "X (Twitter)", name: "X Followers", rate: 6.5, min: 100, max: 20000, active: true },
  { id: 13, category: "Telegram", name: "Telegram Channel Members", rate: 4.5, min: 100, max: 50000, active: true },
  { id: 14, category: "Spotify", name: "Spotify Plays", rate: 1.5, min: 1000, max: 100000, active: true },
  { id: 15, category: "Website", name: "Website Traffic — Worldwide", rate: 0.7, min: 1000, max: 500000, active: true },
];

export function seedDB(): DB {
  return {
    users: [
      { name: "Admin", email: "admin@frinjo.me", pass: "admin123", balance: 0, role: "admin" },
      { name: "Demo User", email: "demo@frinjo.me", pass: "demo123", balance: 25, role: "user" },
    ],
    services: SEED_SERVICES,
    orders: [],
    funds: [],
    provider: { name: "", apiUrl: "", apiKey: "" },
  };
}

export function chargeFor(rate: number, qty: number): number {
  return Math.round((rate * qty) / 1000 * 100) / 100;
}

let oid = 1000;
let fid = 1000;

type View = "dashboard" | "order" | "orders" | "funds" | "services" | "admin" | "provider";

export default function SmmPanel() {
  const [db, setDb] = useState<DB>(seedDB);
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState<string>("");
  const [view, setView] = useState<View>("dashboard");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [cat, setCat] = useState("Instagram");
  const [serviceId, setServiceId] = useState(1);
  const [link, setLink] = useState("");
  const [qty, setQty] = useState("1000");
  const [orderMsg, setOrderMsg] = useState("");
  const [fundAmt, setFundAmt] = useState("");
  const [fundMethod, setFundMethod] = useState("Binance (USDT)");
  const [fundNote, setFundNote] = useState("");
  const [fundMsg, setFundMsg] = useState("");
  const [provName, setProvName] = useState("");
  const [provUrl, setProvUrl] = useState("");
  const [provKey, setProvKey] = useState("");
  const [newSvc, setNewSvc] = useState({ category: "Instagram", name: "", rate: "1.00", min: "100", max: "10000" });
  const [balAdd, setBalAdd] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) setDb(JSON.parse(raw));
      const s = localStorage.getItem(STORE_KEY + "-session");
      if (s) setSession(s);
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); } catch { /* ignore */ }
  }, [db, loaded]);
  useEffect(() => {
    setProvName(db.provider.name); setProvUrl(db.provider.apiUrl); setProvKey(db.provider.apiKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const me = db.users.find((u) => u.email === session) || null;
  const categories = useMemo(() => [...new Set(db.services.map((s) => s.category))], [db.services]);
  const catServices = db.services.filter((s) => s.category === cat);
  const selected = db.services.find((s) => s.id === serviceId) || catServices[0];
  const qtyNum = Math.floor(Number(qty) || 0);
  const charge = selected ? chargeFor(selected.rate, qtyNum) : 0;
  const myOrders = me ? db.orders.filter((o) => o.userEmail === me.email) : [];
  const mySpent = myOrders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.charge, 0);
  const providerOn = db.provider.apiKey.trim().length > 0;

  function signup() {
    if (!name.trim() || !email.trim() || pass.length < 6) { setAuthMsg("Name, email aur kam az kam 6 characters ka password chahiye."); return; }
    if (db.users.some((u) => u.email === email.trim().toLowerCase())) { setAuthMsg("Ye email pehle se registered hai — login karo."); return; }
    const u: SmmUser = { name: name.trim(), email: email.trim().toLowerCase(), pass, balance: 0, role: "user" };
    setDb((d) => ({ ...d, users: [...d.users, u] }));
    setSession(u.email);
    try { localStorage.setItem(STORE_KEY + "-session", u.email); } catch { /* ignore */ }
    setAuthMsg("");
  }
  function login() {
    const u = db.users.find((x) => x.email === email.trim().toLowerCase() && x.pass === pass);
    if (!u) { setAuthMsg("Email ya password ghalat hai."); return; }
    setSession(u.email);
    try { localStorage.setItem(STORE_KEY + "-session", u.email); } catch { /* ignore */ }
    setAuthMsg("");
  }
  function logout() {
    setSession("");
    try { localStorage.removeItem(STORE_KEY + "-session"); } catch { /* ignore */ }
  }
  function placeOrder() {
    if (!me || !selected) return;
    if (!link.trim()) { setOrderMsg("Link zaroor likho (profile ya post ka URL)."); return; }
    if (qtyNum < selected.min || qtyNum > selected.max) { setOrderMsg(`Quantity ${selected.min} se ${selected.max} ke darmiyan honi chahiye.`); return; }
    if (me.balance < charge) { setOrderMsg(`Balance kam hai — $${charge.toFixed(2)} chahiye, balance $${me.balance.toFixed(2)} hai. Pehle funds add karo.`); return; }
    const order: SmmOrder = {
      id: ++oid + Math.floor(Math.random() * 100000), userEmail: me.email, serviceId: selected.id,
      link: link.trim(), qty: qtyNum, charge, status: "Pending",
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      providerRef: providerOn ? `AUTO-${Math.floor(100000 + Math.random() * 900000)}` : "MANUAL",
    };
    setDb((d) => ({
      ...d,
      orders: [order, ...d.orders],
      users: d.users.map((u) => (u.email === me.email ? { ...u, balance: Math.round((u.balance - charge) * 100) / 100 } : u)),
    }));
    setOrderMsg(`Order #${order.id} lag gaya — $${charge.toFixed(2)} balance se kata. ${providerOn ? "Provider ko auto-forward ho gaya hai." : "Admin isay manually process karega."}`);
    setLink("");
  }
  function requestFunds() {
    if (!me) return;
    const amt = Number(fundAmt);
    if (!(amt > 0)) { setFundMsg("Sahi amount likho."); return; }
    const fr: FundRequest = { id: ++fid + Math.floor(Math.random() * 100000), userEmail: me.email, amount: amt, method: fundMethod, note: fundNote.trim(), status: "Pending" };
    setDb((d) => ({ ...d, funds: [fr, ...d.funds] }));
    setFundMsg("Request bhej di gayi hai — payment karke admin ko inform karo, approval par balance add ho jayega.");
    setFundAmt(""); setFundNote("");
  }
  function setOrderStatus(order: SmmOrder, status: OrderStatus) {
    setDb((d) => {
      let users = d.users;
      if (status === "Cancelled" && order.status !== "Cancelled") {
        users = users.map((u) => (u.email === order.userEmail ? { ...u, balance: Math.round((u.balance + order.charge) * 100) / 100 } : u));
      }
      return { ...d, users, orders: d.orders.map((o) => (o.id === order.id ? { ...o, status } : o)) };
    });
  }
  function decideFund(fr: FundRequest, approve: boolean) {
    setDb((d) => ({
      ...d,
      funds: d.funds.map((f) => (f.id === fr.id ? { ...f, status: approve ? "Approved" as const : "Rejected" as const } : f)),
      users: approve ? d.users.map((u) => (u.email === fr.userEmail ? { ...u, balance: Math.round((u.balance + fr.amount) * 100) / 100 } : u)) : d.users,
    }));
  }
  function addBalance(emailTo: string) {
    const amt = Number(balAdd[emailTo]);
    if (!(amt > 0)) return;
    setDb((d) => ({ ...d, users: d.users.map((u) => (u.email === emailTo ? { ...u, balance: Math.round((u.balance + amt) * 100) / 100 } : u)) }));
    setBalAdd((b) => ({ ...b, [emailTo]: "" }));
  }
  function saveProvider() {
    setDb((d) => ({ ...d, provider: { name: provName.trim(), apiUrl: provUrl.trim(), apiKey: provKey.trim() } }));
  }
  function addService() {
    const rate = Number(newSvc.rate);
    if (!newSvc.name.trim() || !(rate > 0)) return;
    const id = Math.max(0, ...db.services.map((s) => s.id)) + 1;
    setDb((d) => ({ ...d, services: [...d.services, { id, category: newSvc.category, name: newSvc.name.trim(), rate, min: Number(newSvc.min) || 1, max: Number(newSvc.max) || 1000, active: true }] }));
    setNewSvc({ ...newSvc, name: "" });
  }

  const statusColor: Record<OrderStatus, string> = {
    Pending: "bg-amber-100 text-amber-800",
    "In Progress": "bg-sky-100 text-sky-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  /* ---------- LOGGED OUT: catalog + auth ---------- */
  if (!me) {
    return (
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <h2 className="font-display text-3xl font-bold text-stone-900">Services &amp; Rates <span className="text-base font-sans font-semibold text-stone-400">(per 1,000)</span></h2>
            <div className="mt-5 space-y-6">
              {categories.map((c) => (
                <div key={c}>
                  <h3 className="font-display text-xl font-bold text-orange-700">{c}</h3>
                  <div className="mt-2 overflow-hidden rounded-2xl border border-stone-200">
                    {db.services.filter((s) => s.category === c && s.active).map((s) => (
                      <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 bg-white px-5 py-3 border-b border-stone-100 last:border-0">
                        <span className="font-semibold text-stone-800">{s.name}</span>
                        <span className="text-sm text-stone-500">Min {s.min.toLocaleString()} · Max {s.max.toLocaleString()} · <strong className="text-stone-900">${s.rate.toFixed(2)} / 1k</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-stone-400">Rates demo hain — provider connect hote hi asal rates + tumhara margin lag jayega. Panel is waqt demo mode me hai: accounts aur orders tumhare browser me mehfooz hote hain.</p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm h-fit lg:sticky lg:top-6">
            <div className="flex rounded-full border border-stone-300 overflow-hidden mb-5">
              {(["login", "signup"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setAuthMode(m)} className={`flex-1 px-4 py-2.5 text-sm font-bold ${authMode === m ? "bg-stone-900 text-white" : "bg-white text-stone-600"}`}>
                  {m === "login" ? "Login" : "Sign up"}
                </button>
              ))}
            </div>
            {authMode === "signup" && (
              <div className="mb-4">
                <label className={labelCls} htmlFor="smm-name">Name</label>
                <input id="smm-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
            )}
            <div className="mb-4">
              <label className={labelCls} htmlFor="smm-email">Email</label>
              <input id="smm-email" type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
            </div>
            <div className="mb-5">
              <label className={labelCls} htmlFor="smm-pass">Password</label>
              <input id="smm-pass" type="password" className={inputCls} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />
            </div>
            {authMsg && <p className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">{authMsg}</p>}
            <button type="button" onClick={authMode === "login" ? login : signup} className="w-full rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 transition">
              {authMode === "login" ? "Login to Panel" : "Create Account"}
            </button>
            <div className="mt-5 rounded-2xl bg-white border border-stone-200 px-4 py-3 text-sm text-stone-600">
              <p className="font-bold text-stone-800">Demo accounts (try karne ke liye):</p>
              <p className="mt-1">User: <code className="bg-stone-100 px-1 rounded">demo@frinjo.me</code> / <code className="bg-stone-100 px-1 rounded">demo123</code> ($25 balance)</p>
              <p>Admin: <code className="bg-stone-100 px-1 rounded">admin@frinjo.me</code> / <code className="bg-stone-100 px-1 rounded">admin123</code></p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- LOGGED IN: panel ---------- */
  const tabs: { key: View; label: string; adminOnly?: boolean }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "order", label: "New Order" },
    { key: "orders", label: "My Orders" },
    { key: "funds", label: "Add Funds" },
    { key: "services", label: "Services" },
    { key: "admin", label: "Admin", adminOnly: true },
    { key: "provider", label: "Provider API", adminOnly: true },
  ];

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl font-bold text-stone-900">{me.name} <span className="text-sm font-sans font-semibold text-stone-400">({me.email})</span></p>
              <p className="text-sm text-stone-500">Mode: <strong className={providerOn ? "text-green-700" : "text-amber-700"}>{providerOn ? "Provider connected — auto orders" : "Manual — admin orders process karega"}</strong></p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-stone-950 text-white px-5 py-3 font-display font-bold">Balance: <span className="text-orange-400">${me.balance.toFixed(2)}</span></span>
              <button type="button" onClick={logout} className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-bold text-stone-600 hover:border-red-300 hover:text-red-600 transition">Logout</button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.filter((t) => !t.adminOnly || me.role === "admin").map((t) => (
              <button key={t.key} type="button" onClick={() => setView(t.key)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${view === t.key ? "bg-stone-900 text-white" : "bg-white border border-stone-300 text-stone-600 hover:border-orange-400"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {view === "dashboard" && (
            <div className="mt-7 grid gap-4 sm:grid-cols-3 text-center">
              {[
                [`$${me.balance.toFixed(2)}`, "Current balance"],
                [`${myOrders.length}`, "Total orders"],
                [`$${mySpent.toFixed(2)}`, "Total spent"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-white border border-stone-200 p-6">
                  <p className="font-display text-3xl font-bold text-stone-900">{v}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">{l}</p>
                </div>
              ))}
              {me.role === "admin" && (
                <>
                  {[
                    [`${db.orders.length}`, "All orders (admin)"],
                    [`${db.users.length}`, "Registered users"],
                    [`${db.funds.filter((f) => f.status === "Pending").length}`, "Pending fund requests"],
                  ].map(([v, l]) => (
                    <div key={l} className="rounded-2xl bg-orange-50 border border-orange-200 p-6">
                      <p className="font-display text-3xl font-bold text-stone-900">{v}</p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">{l}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {view === "order" && (
            <div className="mt-7 rounded-2xl bg-white border border-stone-200 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="ord-cat">Category</label>
                  <select id="ord-cat" className={inputCls} value={cat} onChange={(e) => { setCat(e.target.value); const first = db.services.find((s) => s.category === e.target.value); if (first) setServiceId(first.id); }}>
                    {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="ord-svc">Service</label>
                  <select id="ord-svc" className={inputCls} value={selected?.id ?? ""} onChange={(e) => setServiceId(Number(e.target.value))}>
                    {catServices.filter((s) => s.active).map((s) => (<option key={s.id} value={s.id}>{s.name} — ${s.rate.toFixed(2)}/1k</option>))}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="ord-link">Link</label>
                  <input id="ord-link" className={inputCls} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://instagram.com/username ya post URL" />
                </div>
                <div>
                  <label className={labelCls} htmlFor="ord-qty">Quantity {selected && <span className="text-stone-400 font-semibold">(min {selected.min.toLocaleString()} · max {selected.max.toLocaleString()})</span>}</label>
                  <input id="ord-qty" type="number" className={inputCls} value={qty} onChange={(e) => setQty(e.target.value)} />
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <p className="font-display text-2xl font-bold text-stone-900">Charge: <span className="text-orange-600">${charge.toFixed(2)}</span></p>
                <button type="button" onClick={placeOrder} className="rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3 transition">Place Order</button>
              </div>
              {orderMsg && <p className="mt-4 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-stone-700">{orderMsg}</p>}
            </div>
          )}

          {view === "orders" && (
            <div className="mt-7 overflow-x-auto rounded-2xl bg-white border border-stone-200">
              {myOrders.length === 0 ? (
                <p className="px-6 py-8 text-center text-stone-400">Abhi koi order nahi — New Order se pehla order lagao.</p>
              ) : (
                <table className="w-full text-sm min-w-[640px]">
                  <thead><tr className="text-left text-stone-500 border-b border-stone-100">
                    <th className="px-5 py-3">ID</th><th className="px-5 py-3">Service</th><th className="px-5 py-3">Qty</th><th className="px-5 py-3">Charge</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th>
                  </tr></thead>
                  <tbody>
                    {myOrders.map((o) => (
                      <tr key={o.id} className="border-b border-stone-50">
                        <td className="px-5 py-3 font-bold text-stone-800">#{o.id}</td>
                        <td className="px-5 py-3 text-stone-600">{db.services.find((s) => s.id === o.serviceId)?.name ?? "Service"}</td>
                        <td className="px-5 py-3 text-stone-600">{o.qty.toLocaleString()}</td>
                        <td className="px-5 py-3 font-semibold text-stone-800">${o.charge.toFixed(2)}</td>
                        <td className="px-5 py-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor[o.status]}`}>{o.status}</span></td>
                        <td className="px-5 py-3 text-stone-400">{o.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {view === "funds" && (
            <div className="mt-7 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-white border border-stone-200 p-6">
                <h3 className="font-display text-xl font-bold text-stone-900">Payment methods</h3>
                <ul className="mt-3 space-y-2 text-sm text-stone-600 leading-relaxed">
                  <li><strong className="text-stone-900">Binance (USDT):</strong> payment Muhammadraza512512@gmail.com par bhejo</li>
                  <li><strong className="text-stone-900">Payoneer:</strong> Muhammadraza512512@gmail.com</li>
                  <li><strong className="text-stone-900">JazzCash / Easypaisa:</strong> 03360723375</li>
                </ul>
                <p className="mt-3 text-sm text-stone-400">Payment ke baad neeche request bhej do — admin verify karke balance add kar dega.</p>
                <div className="mt-5 grid gap-4">
                  <div>
                    <label className={labelCls} htmlFor="fund-amt">Amount (USD)</label>
                    <input id="fund-amt" type="number" step="any" className={inputCls} value={fundAmt} onChange={(e) => setFundAmt(e.target.value)} placeholder="10" />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="fund-method">Method</label>
                    <select id="fund-method" className={inputCls} value={fundMethod} onChange={(e) => setFundMethod(e.target.value)}>
                      {["Binance (USDT)", "Payoneer", "JazzCash", "Easypaisa"].map((m) => (<option key={m} value={m}>{m}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="fund-note">Transaction note / TXID</label>
                    <input id="fund-note" className={inputCls} value={fundNote} onChange={(e) => setFundNote(e.target.value)} placeholder="TXID ya sender name" />
                  </div>
                  <button type="button" onClick={requestFunds} className="rounded-full bg-stone-900 text-white font-bold px-6 py-3 hover:bg-stone-800 transition">Submit Request</button>
                  {fundMsg && <p className="rounded-xl bg-green-50 border border-green-200 px-4 py-2.5 text-sm text-green-700">{fundMsg}</p>}
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-stone-200 p-6">
                <h3 className="font-display text-xl font-bold text-stone-900">Meri requests</h3>
                <div className="mt-3 space-y-2">
                  {db.funds.filter((f) => f.userEmail === me.email).length === 0 && <p className="text-sm text-stone-400">Koi request nahi.</p>}
                  {db.funds.filter((f) => f.userEmail === me.email).map((f) => (
                    <p key={f.id} className="flex justify-between rounded-xl bg-stone-50 px-4 py-2.5 text-sm">
                      <span className="font-semibold text-stone-700">${f.amount.toFixed(2)} · {f.method}</span>
                      <span className="font-bold text-stone-500">{f.status}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "services" && (
            <div className="mt-7 space-y-6">
              {categories.map((c) => (
                <div key={c}>
                  <h3 className="font-display text-lg font-bold text-orange-700">{c}</h3>
                  <div className="mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                    {db.services.filter((s) => s.category === c).map((s) => (
                      <div key={s.id} className="flex flex-wrap justify-between gap-2 px-5 py-3 border-b border-stone-100 last:border-0">
                        <span className="font-semibold text-stone-800">{s.name} {!s.active && <span className="text-red-500 text-xs font-bold">(OFF)</span>}</span>
                        <span className="text-sm text-stone-500">${s.rate.toFixed(2)} / 1k · min {s.min.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === "admin" && me.role === "admin" && (
            <div className="mt-7 space-y-8">
              <div>
                <h3 className="font-display text-xl font-bold text-stone-900">All Orders — status badlo (Cancel par auto-refund)</h3>
                <div className="mt-3 overflow-x-auto rounded-2xl bg-white border border-stone-200">
                  {db.orders.length === 0 ? <p className="px-6 py-6 text-center text-stone-400">Koi order nahi.</p> : (
                    <table className="w-full text-sm min-w-[680px]">
                      <thead><tr className="text-left text-stone-500 border-b border-stone-100">
                        <th className="px-5 py-3">ID</th><th className="px-5 py-3">User</th><th className="px-5 py-3">Link</th><th className="px-5 py-3">Qty</th><th className="px-5 py-3">Charge</th><th className="px-5 py-3">Ref</th><th className="px-5 py-3">Status</th>
                      </tr></thead>
                      <tbody>
                        {db.orders.map((o) => (
                          <tr key={o.id} className="border-b border-stone-50">
                            <td className="px-5 py-3 font-bold">#{o.id}</td>
                            <td className="px-5 py-3 text-stone-600">{o.userEmail}</td>
                            <td className="px-5 py-3 text-stone-600 max-w-[180px] truncate">{o.link}</td>
                            <td className="px-5 py-3 text-stone-600">{o.qty.toLocaleString()}</td>
                            <td className="px-5 py-3 font-semibold">${o.charge.toFixed(2)}</td>
                            <td className="px-5 py-3 text-stone-400">{o.providerRef}</td>
                            <td className="px-5 py-3">
                              <select value={o.status} onChange={(e) => setOrderStatus(o, e.target.value as OrderStatus)} className="rounded-lg border border-stone-300 px-2 py-1.5 text-sm font-semibold">
                                {(["Pending", "In Progress", "Completed", "Cancelled"] as OrderStatus[]).map((s) => (<option key={s} value={s}>{s}</option>))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white border border-stone-200 p-6">
                  <h3 className="font-display text-lg font-bold text-stone-900">Fund requests</h3>
                  <div className="mt-3 space-y-2">
                    {db.funds.length === 0 && <p className="text-sm text-stone-400">Koi request nahi.</p>}
                    {db.funds.map((f) => (
                      <div key={f.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-stone-50 px-4 py-2.5 text-sm">
                        <span className="font-semibold text-stone-700">{f.userEmail} · ${f.amount.toFixed(2)} · {f.method} <span className="text-stone-400">({f.status})</span></span>
                        {f.status === "Pending" && (
                          <span className="flex gap-2">
                            <button type="button" onClick={() => decideFund(f, true)} className="rounded-full bg-green-600 text-white px-4 py-1.5 text-xs font-bold">Approve</button>
                            <button type="button" onClick={() => decideFund(f, false)} className="rounded-full bg-red-600 text-white px-4 py-1.5 text-xs font-bold">Reject</button>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <h3 className="font-display text-lg font-bold text-stone-900 mt-7">Users — balance add karo</h3>
                  <div className="mt-3 space-y-2">
                    {db.users.map((u) => (
                      <div key={u.email} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-stone-50 px-4 py-2.5 text-sm">
                        <span className="font-semibold text-stone-700">{u.email} · <strong>${u.balance.toFixed(2)}</strong></span>
                        <span className="flex gap-2">
                          <input type="number" step="any" placeholder="$ add" value={balAdd[u.email] ?? ""} onChange={(e) => setBalAdd((b) => ({ ...b, [u.email]: e.target.value }))} className="w-24 rounded-lg border border-stone-300 px-2 py-1.5" />
                          <button type="button" onClick={() => addBalance(u.email)} className="rounded-full bg-stone-900 text-white px-4 py-1.5 text-xs font-bold">Add</button>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-stone-200 p-6">
                  <h3 className="font-display text-lg font-bold text-stone-900">Nayi service add karo</h3>
                  <div className="mt-3 grid gap-3">
                    <select className={inputCls} value={newSvc.category} onChange={(e) => setNewSvc({ ...newSvc, category: e.target.value })}>
                      {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                    <input className={inputCls} placeholder="Service name" value={newSvc.name} onChange={(e) => setNewSvc({ ...newSvc, name: e.target.value })} />
                    <div className="grid grid-cols-3 gap-3">
                      <input className={inputCls} type="number" step="any" placeholder="Rate /1k" value={newSvc.rate} onChange={(e) => setNewSvc({ ...newSvc, rate: e.target.value })} />
                      <input className={inputCls} type="number" placeholder="Min" value={newSvc.min} onChange={(e) => setNewSvc({ ...newSvc, min: e.target.value })} />
                      <input className={inputCls} type="number" placeholder="Max" value={newSvc.max} onChange={(e) => setNewSvc({ ...newSvc, max: e.target.value })} />
                    </div>
                    <button type="button" onClick={addService} className="rounded-full bg-stone-900 text-white font-bold px-6 py-2.5 hover:bg-stone-800 transition">Add Service</button>
                  </div>
                  <p className="mt-4 text-sm text-stone-400">Service ke rates neeche Services tab me nazar aate hain; kisi service ko band karna ho to Provider/mode ke sath mojood data se manage hota hai — rates badalne ke liye service delete karke nayi add kar do (demo mode).</p>
                </div>
              </div>
            </div>
          )}

          {view === "provider" && me.role === "admin" && (
            <div className="mt-7 rounded-2xl bg-white border border-stone-200 p-6 max-w-2xl">
              <h3 className="font-display text-xl font-bold text-stone-900">Provider API connection</h3>
              <p className="mt-1 text-sm text-stone-500 leading-relaxed">
                Provider (maslan JustAnotherPanel) ka account banao, wahan se API URL aur API key milegi — yahan
                laga do. Key lagte hi panel <strong>Provider mode</strong> me chala jayega: naye orders auto-forward
                honge (is demo build me key sirf setting ke tor par mehfooz hoti hai; live server integration
                production step hai).
              </p>
              <div className="mt-5 grid gap-4">
                <div>
                  <label className={labelCls} htmlFor="prov-name">Provider name</label>
                  <input id="prov-name" className={inputCls} value={provName} onChange={(e) => setProvName(e.target.value)} placeholder="JustAnotherPanel" />
                </div>
                <div>
                  <label className={labelCls} htmlFor="prov-url">API URL</label>
                  <input id="prov-url" className={inputCls} value={provUrl} onChange={(e) => setProvUrl(e.target.value)} placeholder="https://provider-panel.com/api/v2" />
                </div>
                <div>
                  <label className={labelCls} htmlFor="prov-key">API Key</label>
                  <input id="prov-key" type="password" className={inputCls} value={provKey} onChange={(e) => setProvKey(e.target.value)} placeholder="••••••••••••••••" />
                </div>
                <button type="button" onClick={saveProvider} className="rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 transition w-fit">Save Provider</button>
                <p className="text-sm font-semibold text-stone-600">Current mode: {providerOn ? <span className="text-green-700">Provider connected ({db.provider.name || "unnamed"}) — auto orders</span> : <span className="text-amber-700">Manual mode — koi key nahi lagi</span>}</p>
              </div>
            </div>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-stone-400">Demo build: tamam data (accounts, orders, balance) sirf tumhare browser me mehfooz hota hai — asal customers ke liye production backend + provider API live karna hoga.</p>
      </div>
    </section>
  );
}
