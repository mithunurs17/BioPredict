import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { FluidSelection } from "@/components/fluid-selection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FluidSelection />
      </main>
      <Footer />
    </>
  );
}
