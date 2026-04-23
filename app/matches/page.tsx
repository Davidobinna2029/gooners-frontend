import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NextMatch from "@/components/NextMatch";

export default function Page() {
  return (
    <>
      <Header />

      <main className="container page-space">
        <NextMatch />
      </main>

      <Footer />
    </>
  );
}