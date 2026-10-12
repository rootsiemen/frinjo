"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import BlogForm, { BlogFormData } from "@/components/BlogForm";

export default function EditBlogPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [initial, setInitial] = useState<BlogFormData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/blog-posts/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.item) setInitial({ title: d.item.title, excerpt: d.item.excerpt, metaDescription: d.item.metaDescription ?? "", category: d.item.category, content: d.item.content, status: d.item.status });
        else setError("Post not found");
      });
  }, [id]);

  async function submit(data: BlogFormData) {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/blog-posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) { setError(resData.error || "Failed"); setBusy(false); return; }
    router.push("/admin/blog");
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-stone-900">Edit Blog Post</h1>
      {!initial && !error && <p className="mt-6 text-stone-500">Loading…</p>}
      {initial && (
        <BlogForm initial={initial} onSubmit={submit} busy={busy} error={error} submitLabel="Update Post" />
      )}
      {error && !initial && <p className="mt-6 text-red-600 text-sm">{error}</p>}
    </div>
  );
}
