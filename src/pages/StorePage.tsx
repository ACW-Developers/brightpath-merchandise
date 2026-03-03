import { useState } from "react";
import StoreNavigation from "@/components/store/StoreNavigation";
import StoreFooter from "@/components/store/StoreFooter";
import ProductCard from "@/components/store/ProductCard";
import HeroCarousel from "@/components/store/HeroCarousel";
import TrustBadges from "@/components/store/TrustBadges";
import NewsletterSection from "@/components/store/NewsletterSection";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useProducts, useFeaturedProducts, useSaleProducts, useCategories } from "@/hooks/useProducts";
import { Sparkles, Flame, ShoppingBag, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import elevateBg from "@/assets/elevate-brand-bg.jpg";

const StorePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products = [], isLoading } = useProducts(selectedCategory);
  const { data: featured = [] } = useFeaturedProducts();
  const { data: saleProducts = [] } = useSaleProducts();
  const { data: categories = ["All"] } = useCategories();

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <StoreNavigation />
      <main className="pt-16">
        <HeroCarousel />
        <TrustBadges />

        {/* Featured Products */}
        {featured.length > 0 && (
          <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold font-space">Featured Products</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* Sale Section */}
        {saleProducts.length > 0 && (
          <section className="py-16 px-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 via-transparent to-destructive/5" />
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <Flame className="w-6 h-6 text-destructive" />
                <h2 className="text-3xl font-bold font-space">On Sale</h2>
                <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full">HOT</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {saleProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* Promotional Banner with Background */}
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={elevateBg} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-secondary/20" />
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="glass-card p-12 md:p-16 text-center border border-primary/20">
              <TrendingUp className="w-14 h-14 text-primary mx-auto mb-6 animate-pulse-glow" />
              <h2 className="text-3xl md:text-5xl font-bold font-space mb-4">
                Elevate Your <span className="gradient-text">Brand</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                From custom t-shirts and caps to car branding and office signage — we bring your brand to life with premium quality prints.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="gap-2 text-base px-8"
                  onClick={() => window.open("https://wa.me/15207361677?text=" + encodeURIComponent("Hello there, I'm interested in your custom branding service."), "_blank")}
                >
                  Get a Custom Quote
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 text-base px-8"
                  onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Browse Products
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* All Products */}
        <section className="py-16 px-6" id="products">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold font-space">All Products</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Button key={cat} variant={selectedCategory === cat ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(cat)}>
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="glass-card h-80 animate-pulse" />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-xl text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </section>

        <NewsletterSection />
      </main>
      <StoreFooter />
      <WhatsAppWidget />
    </div>
  );
};

export default StorePage;
