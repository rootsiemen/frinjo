"use client";
import { useState } from "react";
import Link from "next/link";

const input = "mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600";

const CATEGORIES = ["Business", "Ecommerce", "Marketing", "SEO", "Design", "Payments", "Performance", "Pricing Guide", "Technology", "Checklist", "General"];

export interface BlogFormData {
  title: string; excerpt: string; metaDescription: string; category: string; content: string; status: string;
}

export default function BlogForm({
  initial, onSubmit, busy, error, submitLabel,
}: {
  initial: BlogFormData;
  onSubmit: (data: BlogFormData) => void;
  busy: boolean; error: string; submitLabel: string;
}) {
  const [form, setForm] = useState(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="mt-6 rounded-2xl bg-white border border-stone-200 p-6 space-y-4">
      <label className="block text-sm font-medium text-stone-700">Title *
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} placeholder="e.g. How Much Does a Website Cost in Pakistan?" />
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-stone-700">Category
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={input}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-stone-700">Status
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={input}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium text-stone-700">Excerpt (short summary)
        <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={input} placeholder="1-2 sentences shown on the blog listing page" />
      </label>
      <label className="block text-sm font-medium text-stone-700">
        Meta description <span className="text-stone-400 font-normal">(Google search snippet · max 160 chars)</span>
        <span className={`float-right text-xs font-normal ${form.metaDescription.length > 160 ? "text-red-600 font-bold" : "text-stone-400"}`}>{form.metaDescription.length}/160</span>
        <textarea rows={2} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className={input} placeholder="Click-worthy 1-2 lines with the target keyword — this is what Google shows under the title" />
      </label>
      <label className="block text-sm font-medium text-stone-700">Content *
        <textarea required rows={16} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={`${input} font-mono`} placeholder={"Write paragraphs here.\n\n## Section Heading\n\n- bullet point\n- another bullet\n\n> a highlighted tip"} />
      </label>
      <p className="text-xs text-stone-500">Formatting: blank line = new paragraph · <code>## </code> = heading · <code>- </code> = bullet · <code>&gt; </code> = highlighted tip</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button disabled={busy} className="rounded-full bg-emerald-950 text-white font-bold px-6 py-2.5 text-sm hover:bg-emerald-900 disabled:opacity-40">
          {busy ? "Saving…" : submitLabel}
        </button>
        <Link href="/admin/blog" className="rounded-full border border-stone-300 px-6 py-2.5 text-sm font-semibold">Cancel</Link>
      </div>
    </form>
  );
}
