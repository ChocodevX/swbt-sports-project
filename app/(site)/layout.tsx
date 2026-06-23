import SiteNav from "@/components/SiteNav";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#030b18] text-white">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 pb-16 pt-28">{children}</main>
    </div>
  );
}
