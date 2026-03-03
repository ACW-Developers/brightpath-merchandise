import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Minus, Plus, Trash2, Send } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCartStore();

  const handleOrder = async () => {
    if (!form.name || !form.email) {
      toast({ title: "Missing info", description: "Please fill in your name and email.", variant: "destructive" });
      return;
    }
    setIsOrdering(true);
    try {
      const orderItems = items.map(i => ({
        product_id: i.product.id,
        name: i.product.name,
        price: i.product.is_on_sale && i.product.sale_price ? i.product.sale_price : i.product.price,
        quantity: i.quantity,
      }));

      const { error } = await supabase.from('orders').insert({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        items: orderItems,
        total_amount: totalPrice(),
      });

      if (error) throw error;

      // Also send via WhatsApp
      const message = `New Order from ${form.name}\n${items.map(i => `${i.product.name} x${i.quantity}`).join('\n')}\nTotal: $${totalPrice().toFixed(2)}\nEmail: ${form.email}\nPhone: ${form.phone}`;
      window.open(`https://wa.me/15207361677?text=${encodeURIComponent(message)}`, "_blank");

      clearCart();
      setShowCheckout(false);
      setForm({ name: "", email: "", phone: "" });
      setIsOpen(false);
      toast({ title: "Order placed!", description: "We'll contact you shortly via WhatsApp." });
    } catch (err) {
      toast({ title: "Order failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
              {totalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="font-space">Shopping Cart</SheetTitle>
          <SheetDescription>{totalItems()} item{totalItems() !== 1 ? 's' : ''} in cart</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-4 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            </div>
          ) : showCheckout ? (
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 8900" />
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary text-xl">${totalPrice().toFixed(2)}</span>
                </div>
                <Button onClick={handleOrder} disabled={isOrdering} className="w-full gap-2" size="lg">
                  <Send className="w-4 h-4" /> {isOrdering ? "Placing Order..." : "Place Order via WhatsApp"}
                </Button>
                <Button variant="ghost" onClick={() => setShowCheckout(false)} className="w-full mt-2">Back to Cart</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 rounded-xl bg-muted/20">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">🖼</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                      <p className="text-sm text-primary font-semibold">
                        ${((item.product.is_on_sale && item.product.sale_price ? item.product.sale_price : item.product.price) * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => removeItem(item.product.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-shrink-0 pt-4 border-t border-border space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary text-xl">${totalPrice().toFixed(2)}</span>
                </div>
                <Button onClick={() => setShowCheckout(true)} className="w-full" size="lg">
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
