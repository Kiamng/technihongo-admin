import Header from "@/components/header/header";
import Navigation from "@/components/nav/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-row flex-1 overflow-hidden">
        <Navigation />
        <div className="flex-1 overflow-y-auto p-10">{children}

        </div>
      </div>
    </section>
  );
}
