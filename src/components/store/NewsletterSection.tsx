import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Mail, Sparkles } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "Subscribed!", description: "You'll receive updates on new products & deals." });
    setEmail("");
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto glass-card p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5" />
        <div className="relative z-10">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-space mb-2">Stay in the Loop</h2>
          <p className="text-muted-foreground mb-6">Get notified about new products, exclusive deals, and brand tips.</p>
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1"
              required
            />
            <Button type="submit" className="gap-2">
              <Sparkles className="w-4 h-4" /> Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
