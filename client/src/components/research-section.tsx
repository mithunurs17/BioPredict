export function ResearchSection() {
  return (
    <section className="py-10 bg-card" id="research">
      <div className="container mx-auto px-4">
        <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-8">Our Research & Methodology</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background rounded-lg p-5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-pink))] flex items-center justify-center mb-4">
              <i className="ri-flask-line text-xl"></i>
            </div>
            <h3 className="font-poppins font-semibold text-lg mb-3">Data Collection & Processing</h3>
            <p className="text-sm opacity-80">
              Our system is trained on extensive datasets of biomarker profiles from patients with confirmed diagnoses. We use advanced preprocessing techniques including normalization and feature selection to identify the most predictive markers.
            </p>
          </div>
          
          <div className="bg-background rounded-lg p-5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[hsl(var(--neon-green))] to-[hsl(var(--neon-blue))] flex items-center justify-center mb-4">
              <i className="ri-ai-generate text-xl"></i>
            </div>
            <h3 className="font-poppins font-semibold text-lg mb-3">Machine Learning Algorithms</h3>
            <p className="text-sm opacity-80">
              We employ a suite of supervised ML algorithms including Random Forest, Support Vector Machine (SVM), and Neural Networks to identify patterns in biomarker data that correlate with disease onset and progression.
            </p>
          </div>
          
          <div className="bg-background rounded-lg p-5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[hsl(var(--neon-yellow))] to-[hsl(var(--neon-green))] flex items-center justify-center mb-4">
              <i className="ri-line-chart-line text-xl"></i>
            </div>
            <h3 className="font-poppins font-semibold text-lg mb-3">Validation & Performance</h3>
            <p className="text-sm opacity-80">
              Our models undergo rigorous validation using cross-validation techniques and are continuously improved based on new data. Current accuracy rates exceed 85% for most conditions, with ongoing research to further enhance predictive capabilities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
