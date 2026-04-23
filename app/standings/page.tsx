import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Standings from "@/components/Standings";

export default function Page() {
  return (
    <>
      <Header />

      <main className="container page-space">
        <Standings />
      </main>

      <Footer />
    </>
  );
}