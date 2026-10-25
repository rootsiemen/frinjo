// Renders blog post body blocks:
// plain string -> paragraph, "## " -> h2, "- " -> bullet list, "> " -> callout,
// "![alt](url)" -> body image.
export default function BlogContent({ blocks }: { blocks: string[] }) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];

  function flushList(key: string) {
    if (list.length) {
      out.push(
        <ul key={key} className="my-5 space-y-2.5">
          {list.map((item, i) => (
            <li key={i} className="flex gap-3 text-stone-700 leading-relaxed">
              <span className="text-orange-500 font-bold shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      list = [];
    }
  }

  blocks.forEach((b, i) => {
    const imgMatch = b.match(/^!\[([^\]]*)\]\((https?:[^)\s]+)\)\s*$/);
    if (imgMatch) {
      flushList(`ul-${i}`);
      out.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={imgMatch[2]} alt={imgMatch[1]} loading="lazy" className="w-full rounded-2xl my-8 border border-orange-100" />
      );
    } else if (b.startsWith("## ")) {
      flushList(`ul-${i}`);
      out.push(
        <h2 key={i} className="font-display text-2xl font-bold text-stone-900 mt-10 mb-4">
          {b.slice(3)}
        </h2>
      );
    } else if (b.startsWith("- ")) {
      list.push(b.slice(2));
    } else if (b.startsWith("> ")) {
      flushList(`ul-${i}`);
      out.push(
        <div key={i} className="my-6 rounded-2xl border-l-4 border-orange-400 bg-orange-50 p-5 text-stone-800 leading-relaxed">
          💡 {b.slice(2)}
        </div>
      );
    } else if (b.trim() === "") {
      flushList(`ul-${i}`);
    } else {
      flushList(`ul-${i}`);
      out.push(
        <p key={i} className="my-4 text-stone-700 leading-relaxed text-[1.05rem]">
          {b}
        </p>
      );
    }
  });
  flushList("ul-end");

  return <>{out}</>;
}
