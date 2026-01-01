import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight, Sparkles, Zap } from "lucide-react";
import decorativeBlob from "@/assets/decorative-blob.svg";

const CTASection = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Decorative SVG Blob */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-20 pointer-events-none">
        <img src={decorativeBlob} alt="" className="w-full h-full animate-float-slow" />
      </div>
      <div className="absolute -left-20 bottom-0 w-[500px] h-[500px] opacity-15 pointer-events-none rotate-180">
        <img src={decorativeBlob} alt="" className="w-full h-full animate-float-slow" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[130px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/15 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="glass-card p-12 md:p-16 relative overflow-hidden group">
          {/* Card inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Floating icons */}
          <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-40 transition-opacity">
            <Sparkles className="w-16 h-16 text-primary animate-float" />
          </div>
          <div className="absolute bottom-8 left-8 opacity-20 group-hover:opacity-40 transition-opacity">
            <Zap className="w-12 h-12 text-secondary animate-float-delayed" />
          </div>

          <div className="relative z-10 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-8">
              <Rocket className="w-4 h-4 text-primary animate-bounce-subtle" />
              <span className="text-sm font-medium text-primary">Let's Build Together</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-space mb-6 leading-tight">
              Ready to Transform
              <br />
              <span className="gradient-text animate-gradient-shift">Your Business?</span>
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
              From innovative digital solutions to premium printing services, 
              we're here to help you succeed in the modern marketplace.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="futuristic-btn group/btn px-8 py-6 text-lg font-semibold"
                >
                  <Rocket className="w-5 h-5 mr-2 group-hover/btn:animate-bounce" />
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/services">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg border-primary/50 hover:border-primary hover:bg-primary/10 transition-all"
                >
                  Explore Services
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 pt-12 border-t border-border/50">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">10+</div>
                <div className="text-sm text-muted-foreground">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">5+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">100%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
