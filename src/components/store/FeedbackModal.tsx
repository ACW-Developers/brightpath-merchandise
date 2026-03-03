import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Star, Loader2, Heart } from "lucide-react";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId?: string;
  items?: Array<{ product_id: string; name: string }>;
  customerName?: string;
  customerEmail?: string;
}

const FeedbackModal = ({ open, onOpenChange, orderId, items = [], customerName = "", customerEmail = "" }: FeedbackModalProps) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!customerName || !customerEmail) return;
    setSubmitting(true);
    try {
      // Submit a review for each product in the order
      const inserts = items.map((item) => ({
        product_id: item.product_id,
        order_id: orderId || null,
        customer_name: customerName,
        customer_email: customerEmail,
        rating,
        comment: comment || null,
        is_verified_purchase: true,
      }));
      
      if (inserts.length > 0) {
        await supabase.from("product_reviews").insert(inserts);
      }
      
      setSubmitted(true);
      toast({ title: "Thank you!", description: "Your feedback helps us improve." });
    } catch {
      toast({ title: "Failed to submit", variant: "destructive" });
    }
    setSubmitting(false);
  };

  const handleClose = () => {
    setSubmitted(false);
    setRating(5);
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-space flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            {submitted ? "Thank You!" : "How was your experience?"}
          </DialogTitle>
          <DialogDescription>
            {submitted ? "We appreciate your feedback!" : "Your review helps other customers and helps us improve."}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-green-400 fill-green-400" />
            </div>
            <p className="text-lg font-semibold mb-2">Your feedback has been recorded!</p>
            <p className="text-sm text-muted-foreground mb-6">Thank you for shopping with BrightPath Merchandise</p>
            <Button onClick={handleClose}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Rate your experience</p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-125 p-1"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        i <= (hover || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {rating === 5 ? "Excellent!" : rating === 4 ? "Great!" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tell us more (optional)</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you love? What can we improve?"
                rows={3}
              />
            </div>

            <Button onClick={handleSubmit} disabled={submitting} className="w-full gap-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Feedback
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
