import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Star, MessageSquare, User, Loader2 } from "lucide-react";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  is_verified_purchase: boolean;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
}

const StarRating = ({ rating, onChange, size = "md" }: { rating: number; onChange?: (r: number) => void; size?: "sm" | "md" }) => {
  const [hover, setHover] = useState(0);
  const px = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          className={`${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        >
          <Star
            className={`${px} ${
              i <= (hover || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rating: 5, comment: "" });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    setReviews((data as Review[]) || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.rating) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      customer_name: form.name,
      customer_email: form.email,
      rating: form.rating,
      comment: form.comment || null,
    });
    if (error) {
      toast({ title: "Failed to submit review", variant: "destructive" });
    } else {
      toast({ title: "Review submitted!", description: "Thank you for your feedback!" });
      setForm({ name: "", email: "", rating: 5, comment: "" });
      setShowForm(false);
      fetchReviews();
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <section className="mt-16">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold font-space">Customer Reviews</h2>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Average */}
        <div className="glass-card p-6 text-center">
          <div className="text-5xl font-bold font-space text-primary mb-2">{avgRating.toFixed(1)}</div>
          <StarRating rating={Math.round(avgRating)} size="md" />
          <p className="text-sm text-muted-foreground mt-2">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Distribution */}
        <div className="glass-card p-6 col-span-1 md:col-span-2 space-y-2">
          {ratingDistribution.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm w-8 text-right font-medium">{star}★</span>
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} variant="outline" className="mb-8 gap-2">
          <Star className="w-4 h-4" /> Write a Review
        </Button>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-10 space-y-4">
          <h3 className="font-bold font-space text-lg">Share Your Experience</h3>
          <div>
            <label className="text-sm font-medium mb-2 block">Your Rating *</label>
            <StarRating rating={form.rating} onChange={(r) => setForm((p) => ({ ...p, rating: r }))} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name *</label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email *</label>
              <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Your Review</label>
            <Textarea value={form.comment} onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))} placeholder="Tell us about your experience..." rows={4} />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Review
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 glass-card">
          <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{review.customer_name}</span>
                      {review.is_verified_purchase && (
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">Verified Purchase</span>
                      )}
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground leading-relaxed pl-[52px]">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
