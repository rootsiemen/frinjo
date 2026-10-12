"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BlogForm from "@/components/BlogForm";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(data: { title: string; excerpt: string; metaDescription: string; category: string; content: string; status: string }) {
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/blog-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) { setError(resData.error || "Failed"); setBusy(false); return; }
    router.push("/admin/blog");
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-stone-900">New Blog Post</h1>
      <BlogForm
        initial={{ title: "", excerpt: "", metaDescription: "", category: "Business", content: "", status: "draft" }}
        onSubmit={submit}
        busy={busy}
        error={error}
        submitLabel="Save Post"
      />
    </div>
  );
}
