import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { ShopifyProductGrid } from "@/components/ShopifyProductGrid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shirt, Printer, Star, ShoppingBag } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";

// Import sample work images
import tshirtImg from "@/assets/printing/tshirt.jpeg";
import tshirt1Img from "@/assets/printing/tshirt1.jpeg";
import capImg from "@/assets/printing/cap.jpeg";
import mugImg from "@/assets/printing/mug.jpeg";
import carImg from "@/assets/printing/car.png";
import officeImg from "@/assets/printing/office.jpeg";
import bannersImg from "@/assets/printing/banners.jpeg";
import stickersImg from "@/assets/printing/stickers.jpeg";
import bussImg from "@/assets/printing/buss.jpeg";
import heroImage from "@/assets/hero-bg.jpg";

const merchandiseCategories = [
  { icon: Shirt, title: "Apparel", description: "Custom t-shirts, hoodies, sweatshirts & more", image: tshirtImg },
  { icon: ShoppingBag, title: "Headwear", description: "Branded caps, beanies & headwear", image: capImg },
  { icon: Star, title: "Promotional", description: "Mugs, pens, bags & branded items", image: mugImg },
  { icon: Printer, title: "Print Media", description: "Cards, banners, stickers & signage", image: bannersImg },
];

const sampleWorks = [
  { title: "Custom T-Shirts", image: tshirtImg },
  { title: "Branded Apparel", image: tshirt1Img },
  { title: "Corporate Caps", image: capImg },
  { title: "Promotional Mugs", image: mugImg },
  { title: "Vehicle Branding", image: carImg },
  { title: "Office Branding", image: officeImg },
  { title: "Event Banners", image: bannersImg },
  { title: "Custom Stickers", image: stickersImg },
  { title: "Business Cards", image: bussImg },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center hero-bg overflow-hidden">
          <div className="particles">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 20}s`,
                  animationDuration: `${15 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>

          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="max-w-2xl text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-md rounded-full px-4 py-1 mb-6 border border-primary/20">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium">Premium Merchandise & Branding</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold font-space mb-6 animate-slide-in-left">
                  <span className="gradient-text">BrightPath</span>
                  <br />
                  <span className="text-foreground">Merchandise</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Premium custom merchandise, printing & branding solutions. From custom apparel to corporate branding — we bring your vision to life with quality that speaks.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
                  <a href="#shop">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 group">
                      Shop Now
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                  <Link to="/services/printing-branding">
                    <Button size="lg" variant="outline" className="text-lg px-8 border-primary/50 hover:border-primary">
                      Our Services
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hero Images Collage */}
              <div className="relative w-full lg:w-1/2 hidden lg:block">
                <div className="relative w-80 h-80 mx-auto">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] animate-pulse-glow" />
                  <div className="absolute -left-4 top-0 w-40 h-40 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl animate-float z-20">
                    <img src={tshirtImg} alt="Custom T-Shirts" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute right-0 top-8 w-44 h-44 rounded-2xl overflow-hidden border-2 border-secondary/30 shadow-2xl animate-float z-10" style={{ animationDelay: '1s' }}>
                    <img src={capImg} alt="Branded Caps" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute left-8 bottom-0 w-48 h-36 rounded-2xl overflow-hidden border-2 border-accent/30 shadow-2xl animate-float z-30" style={{ animationDelay: '2s' }}>
                    <img src={mugImg} alt="Promotional Products" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Merchandise Categories */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold font-space mb-4">
                What We <span className="gradient-text">Offer</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From custom apparel to corporate branding — everything you need to make your brand shine
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {merchandiseCategories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.title} className="glass-card group overflow-hidden hover:scale-105 transition-all duration-500" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="relative h-40 overflow-hidden">
                      <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold font-space mb-1">{cat.title}</h3>
                      <p className="text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Shop Section - Shopify Products */}
        <section id="shop" className="py-20 px-6 about-bg">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold font-space mb-4">
                Shop <span className="gradient-text">Merchandise</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse our collection of premium branded merchandise
              </p>
            </div>
            <ShopifyProductGrid />
          </div>
        </section>

        {/* Sample Works */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold font-space mb-4">
                Our <span className="gradient-text">Work</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A showcase of our printing and branding projects delivered to satisfied clients
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sampleWorks.map((work, i) => (
                <div key={work.title} className="group relative overflow-hidden rounded-2xl aspect-square" style={{ animationDelay: `${i * 0.05}s` }}>
                  <img src={work.image} alt={work.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-bold font-space text-foreground">{work.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/projects">
                <Button variant="outline" size="lg" className="border-primary/50 hover:border-primary">
                  View All Projects <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
