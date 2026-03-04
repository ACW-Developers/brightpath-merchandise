import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import StoreNavigation from "@/components/store/StoreNavigation";
import StoreFooter from "@/components/store/StoreFooter";
import ProductCard from "@/components/store/ProductCard";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, Minus, Plus, ArrowLeft, Loader2, Sparkles, ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Product } from "@/types/product";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  is_verified_purchase: boolean;
  created_at: string;
}

const StarDisplay = ({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} className={`${size} ${s <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/20"}`} />
    ))}
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if (data) {
        const p = data as Product;
        setProduct(p);

        const { data: imgs } = await supabase.from("product_images").select("image_url").eq("product_id", id).order("display_order");
        const allImages = [p.image_url, ...(imgs || []).map((i: any) => i.image_url)].filter(Boolean) as string[];
        setImages(allImages.length > 0 ? allImages : []);

        const { data: rel } = await supabase.from("products").select("*").eq("category", p.category).neq("id", id).limit(4);
        setRelated((rel as Product[]) || []);

        const { data: revs } = await supabase.from("product_reviews").select("*").eq("product_id", id).order("created_at", { ascending: false });
        setReviews((revs as Review[]) || []);
      }
      setLoading(false);
    };
    fetchProduct();
    setCurrentImage(0);
    setQuantity(1);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addItem(product);
    toast({ title: "Added to cart", description: `${quantity}x ${product.name} added.` });
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StoreNavigation />
        <div className="pt-20 flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <StoreNavigation />
        <div className="pt-20 text-center py-32">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/shop"><Button>Back to Shop</Button></Link>
        </div>
      </div>
    );
  }

  const effectivePrice = product.is_on_sale && product.sale_price ? product.sale_price : product.price;

  return (
    <div className="min-h-screen bg-background">
      <StoreNavigation />
      <main className="pt-20 pb-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Image gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden glass-card">
                {images.length > 0 ? (
                  <img src={images[currentImage]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Sparkles className="w-20 h-20 text-muted-foreground/20" />
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors">
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button onClick={() => setCurrentImage(i => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}
                {product.is_on_sale && (
                  <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full">SALE</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImage(i)}
                      className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === currentImage ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-bold font-space mb-4">{product.name}</h1>

              {/* Rating summary */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <StarDisplay rating={Math.round(avgRating)} />
                  <span className="text-sm text-muted-foreground">
                    {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-primary font-space">${effectivePrice.toFixed(2)}</span>
                {product.is_on_sale && product.sale_price && (
                  <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                )}
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
              )}

              <div className="flex items-center gap-3 mb-2 text-sm text-muted-foreground">
                <span>Stock: {product.stock_quantity > 0 ? <span className="text-green-400">{product.stock_quantity} available</span> : <span className="text-destructive">Out of stock</span>}</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-10 text-center font-semibold">{quantity}</span>
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity(q => q + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button size="lg" className="gap-2 w-full md:w-auto" onClick={handleAddToCart} disabled={product.stock_quantity <= 0}>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart — ${(effectivePrice * quantity).toFixed(2)}
              </Button>
            </div>
          </div>

          {/* Reviews Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <h2 className="text-2xl font-bold font-space">Customer Reviews</h2>
              {reviews.length > 0 && (
                <span className="text-sm text-muted-foreground">({reviews.length})</span>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Star className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground">No reviews yet. Be the first to purchase and leave feedback!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Rating overview */}
                <div className="glass-card p-6 mb-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary font-space">{avgRating.toFixed(1)}</p>
                      <StarDisplay rating={Math.round(avgRating)} />
                      <p className="text-xs text-muted-foreground mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map(star => {
                        const count = reviews.filter(r => r.rating === star).length;
                        const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2 text-sm">
                            <span className="w-3 text-right">{star}</span>
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-6 text-right text-muted-foreground text-xs">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Individual reviews */}
                {reviews.map(review => (
                  <div key={review.id} className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                          {review.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{review.customer_name}</p>
                          {review.is_verified_purchase && (
                            <span className="text-xs text-green-400">✓ Verified Purchase</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <StarDisplay rating={review.rating} size="w-3.5 h-3.5" />
                    {review.comment && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Related Products */}
          {related.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold font-space mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      </main>
      <StoreFooter />
      <WhatsAppWidget />
    </div>
  );
};

export default ProductDetailPage;
