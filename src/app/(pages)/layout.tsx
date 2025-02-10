import Header from "@/components/header/header";
import Navigation from "@/components/nav/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <Header />
      <div className="flex flex-row h-screen gap-4">
        <Navigation />
        <div className="flex-1 overflow-x-auto">
          <div className="sm:h-[calc(99vh-60px)] overflow-auto">
            <div className="w-full flex pl-4 overflow-auto h-[calc(100vh - 120px)] overflow-y-auto relative">
              <div className="w-full p-5 md:max-w-6xl">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
