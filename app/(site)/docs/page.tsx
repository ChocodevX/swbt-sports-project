export default function DocsPage() {
  const sections = [
    { title: "Getting Started", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
    { title: "Rules", body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo." },
    { title: "Scoring", body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
    { title: "FAQ", body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim." },
  ];

  return (
    <section className="py-8">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Docs</h1>
      <p className="mb-10 text-slate-400">
        Everything you need to know about Sarsas Contest.
      </p>

      <div className="space-y-4">
        {sections.map((s) => (
          <article
            key={s.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
          >
            <h2 className="mb-2 text-xl font-semibold">{s.title}</h2>
            <p className="text-sm leading-relaxed text-slate-300">{s.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
