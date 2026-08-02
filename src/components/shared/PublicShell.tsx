import Footer from "./Footer";

export default function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
