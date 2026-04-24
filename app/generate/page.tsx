import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Wand2, Download, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border/40">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Ktizai</span>
          </div>
          <Link href="/generate">
            <Button variant="outline" size="sm">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Gradient orb background effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/30 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="container relative mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Creative Generation</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 text-balance">
                Create Stunning Ad Creatives in{" "}
                <span className="text-primary">Seconds</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
                Describe your vision and get 5 unique ad creative angles instantly. 
                Add a reference image if you have one, or let AI do all the work.
              </p>
              
              {/* CTA Button */}
              <Link href="/generate">
                <Button size="lg" className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              {/* Trust indicator */}
              <p className="mt-6 text-sm text-muted-foreground">
                No credit card required. Start free today.
              </p>
            </div>
          </div>
          
          </section>

        {/* How It Works Section */}
        <section className="relative py-24 border-t border-border/40 overflow-hidden">
          {/* Subtle background accent */}
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="container relative mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Create professional ad creatives in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="relative group">
                <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Wand2 className="h-7 w-7 text-primary" />
                  </div>
                  <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Describe Your Vision
                  </h3>
                  <p className="text-muted-foreground">
                    Enter a prompt describing your ad creative. Optionally upload a reference image for inspiration.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Get 5 Unique Angles
                  </h3>
                  <p className="text-muted-foreground">
                    AI generates 5 different creative variations, each with a unique angle to test what resonates.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Download className="h-7 w-7 text-primary" />
                  </div>
                  <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Pick and Download
                  </h3>
                  <p className="text-muted-foreground">
                    Choose your favorite creatives and download them in high resolution, ready for any platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-24 border-t border-border/40">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Transform Your Ads?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of marketers creating high-converting ad creatives with Ktizai.
              </p>
              <Link href="/generate">
                <Button size="lg" className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start Creating Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">Ktizai</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with AI. Designed for marketers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
