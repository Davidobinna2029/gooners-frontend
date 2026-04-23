import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LiveScores from "@/components/LiveScores";

export default function Page() {
  return (
    <>
      <Header />

      <main className="container page-space">
        <LiveScores />
      </main>

      <Footer />
    </>
  );
}