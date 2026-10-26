import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AssessmentForm from "@/components/AssessmentForm";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a
        href="#assessment"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to assessment
      </a>
      <Navbar />
      <main>
        <Hero />
        <AssessmentForm />
        <About />
      </main>
      <Footer />
    </>
  );
}
