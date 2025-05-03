import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative py-10 md:py-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-10"></div>
      <div className="container mx-auto px-4 relative z-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-poppins font-bold text-4xl md:text-5xl leading-tight mb-4">
              Predict Health Risks <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-pink))]">Before They Develop</span>
            </h2>
            <p className="text-lg opacity-80 mb-6">
              Using machine learning to analyze biomarkers from your body fluids for early detection of lifestyle diseases.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="px-6 py-3 rounded-md bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-pink))] font-medium hover:shadow-lg hover:opacity-90 transition-all">
                Get Started
              </Button>
              <Button variant="outline" className="px-6 py-3 rounded-md border border-gray-600 hover:border-[hsl(var(--neon-blue))] hover:text-[hsl(var(--neon-blue))] transition-colors">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <img src="https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Medical laboratory" className="rounded-lg shadow-lg max-w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
