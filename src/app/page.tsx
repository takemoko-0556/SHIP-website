import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Concept from "@/components/Concept";
import Facilities from "@/components/Facilities";
import News from "@/components/News";
import Access from "@/components/Access";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Concept />
        <Facilities />
        <News />
        <Access />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
