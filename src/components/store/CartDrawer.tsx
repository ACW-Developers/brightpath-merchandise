import { useState, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Minus, Plus, Trash2, Loader2, Check, Printer, ArrowLeft, DollarSign, Star, Send } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo/logo.png";

type Step = "cart" | "details" | "confirmation";

const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [isOrdering, setIsOrdering] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [receiptData, setReceiptData] = useState<any>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Payment confirmation popup
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [transactionCode, setTransactionCode] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

  // Feedback popup
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState<any[]>([]);

  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCartStore();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePlaceOrder = async () => {
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

      const total = totalPrice();
      const receiptNum = `RCP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

      const { data: order, error: orderError } = await supabase.from("orders").insert({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        items: orderItems as any,
        total_amount: total,
      }).select().single();

      if (orderError) throw orderError;

      await supabase.from("receipts").insert({
        receipt_number: receiptNum,
        order_id: order.id,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        items: orderItems as any,
        subtotal: total,
        tax: 0,
        total_amount: total,
        payment_method: "manual_transfer",
        payment_status: "pending",
      });

      setOrderId(order.id);
      setFeedbackItems(orderItems);
      setReceiptData({
        receipt_number: receiptNum,
        items: orderItems,
        total,
        date: new Date().toLocaleString(),
      });

      clearCart();
      // Show payment instructions popup
      setShowPaymentPopup(true);
      toast({ title: "Order placed!", description: "Follow the payment instructions to complete your order." });
    } catch (err) {
      toast({ title: "Order failed", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsOrdering(false);
    }
  };

  const handlePaymentConfirmation = async () => {
    if (!transactionCode.trim()) {
      toast({ title: "Required", description: "Please enter your transaction confirmation code.", variant: "destructive" });
      return;
    }
    setIsConfirmingPayment(true);
    try {
      // Update the receipt with payment proof
      if (receiptData) {
        await supabase.from("receipts")
          .update({
            payment_status: "confirmed",
            notes: `Transaction: ${transactionCode.trim()}${paymentNote ? ` | Note: ${paymentNote}` : ""}`,
          })
          .eq("receipt_number", receiptData.receipt_number);

        if (orderId) {
          await supabase.from("orders")
            .update({ status: "paid" })
            .eq("id", orderId);
        }
      }

      setShowPaymentPopup(false);
      setStep("confirmation");
      toast({ title: "Payment confirmed!", description: "Your receipt is ready." });
    } catch (err) {
      toast({ title: "Error", description: "Could not save confirmation. Please try again.", variant: "destructive" });
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  const handleSubmitFeedback = async () => {
    setIsSubmittingFeedback(true);
    try {
      const reviews = feedbackItems.map((item: any) => ({
        product_id: item.product_id,
        order_id: orderId,
        customer_name: form.name,
        customer_email: form.email,
        rating: feedbackRating,
        comment: feedbackComment || null,
        is_verified_purchase: true,
      }));

      await supabase.from("product_reviews").insert(reviews);
      setShowFeedbackPopup(false);
      toast({ title: "Thank you! 🎉", description: "Your feedback helps us improve." });
    } catch (err) {
      toast({ title: "Error", description: "Could not submit feedback.", variant: "destructive" });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Receipt</title><style>body{font-family:Arial,sans-serif;padding:30px;max-width:380px;margin:0 auto;color:#333}table{width:100%;border-collapse:collapse}td{padding:3px 0;font-size:13px}.center{text-align:center}.right{text-align:right}.line{border-top:1px dashed #ccc;margin:8px 0}.bold{font-weight:bold}.logo{height:36px}</style></head><body>${content.innerHTML}</body></html>`);
    w.document.close();
    w.print();
  };

  const resetAndClose = () => {
    setStep("cart");
    setForm({ name: "", email: "", phone: "" });
    setReceiptData(null);
    setOrderId(null);
    setTransactionCode("");
    setPaymentNote("");
    setFeedbackRating(5);
    setFeedbackComment("");
    setIsOpen(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => { if (!open) resetAndClose(); else setIsOpen(true); }}>
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
            <SheetTitle className="font-space">
              {step === "cart" && "Shopping Cart"}
              {step === "details" && "Your Details"}
              {step === "confirmation" && "Order Confirmed!"}
            </SheetTitle>
            <SheetDescription>
              {step === "cart" && `${totalItems()} item${totalItems() !== 1 ? 's' : ''} in cart`}
              {step === "details" && "Enter your contact info to place your order"}
              {step === "confirmation" && "Thank you for your order"}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col flex-1 pt-4 min-h-0">
            {/* Step: Cart */}
            {step === "cart" && (
              <>
                {items.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                      <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Your cart is empty</p>
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
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xl">🖼</div>
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
                      <Button onClick={() => setStep("details")} className="w-full" size="lg">
                        Proceed to Checkout
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Step: Details */}
            {step === "details" && (
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

                {/* Order Summary */}
                <div className="glass-card p-4 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Order Summary</p>
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="truncate mr-2">{item.product.name} × {item.quantity}</span>
                      <span className="font-medium">${((item.product.is_on_sale && item.product.sale_price ? item.product.sale_price : item.product.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <Button onClick={handlePlaceOrder} className="w-full gap-2" size="lg" disabled={!form.name || !form.email || isOrdering}>
                    {isOrdering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Place Order
                  </Button>
                  <Button variant="ghost" onClick={() => setStep("cart")} className="w-full gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                </div>
              </div>
            )}

            {/* Step: Confirmation (after payment confirmed) */}
            {step === "confirmation" && receiptData && (
              <div className="flex-1 space-y-4">
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold font-space mb-1">Payment Confirmed!</h3>
                  <p className="text-sm text-muted-foreground">Receipt: {receiptData.receipt_number}</p>
                </div>

                {/* Receipt preview */}
                <div className="glass-card p-4 text-sm" ref={printRef}>
                  <div style={{ textAlign: "center", marginBottom: 12 }}>
                    <img src={logo} alt="Logo" style={{ height: 32, marginBottom: 6, margin: "0 auto", display: "block" }} />
                    <p style={{ fontWeight: "bold", margin: 0 }}>BrightPath Merchandise</p>
                    <p style={{ fontSize: 11, color: "#888" }}>Phoenix, Arizona • +1 (520) 736-1677</p>
                    <div style={{ borderTop: "1px dashed #444", margin: "8px 0" }} />
                    <p style={{ fontWeight: "bold" }}>{receiptData.receipt_number}</p>
                    <p style={{ fontSize: 11, color: "#888" }}>{receiptData.date}</p>
                  </div>
                  <div style={{ borderTop: "1px dashed #444", margin: "8px 0" }} />
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {receiptData.items.map((item: any, i: number) => (
                        <tr key={i}>
                          <td style={{ padding: "2px 0", fontSize: 12 }}>{item.name} x{item.quantity}</td>
                          <td style={{ textAlign: "right", fontSize: 12 }}>${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ borderTop: "1px dashed #444", margin: "8px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 14 }}>
                    <span>Total</span>
                    <span>${receiptData.total.toFixed(2)}</span>
                  </div>
                  <div style={{ borderTop: "1px dashed #444", margin: "8px 0" }} />
                  <p style={{ textAlign: "center", fontSize: 11, color: "#888" }}>Payment: Manual Transfer ✓</p>
                  <p style={{ textAlign: "center", fontSize: 11, fontStyle: "italic", color: "#666", marginTop: 8 }}>Thank you for shopping with us! ❤️</p>
                </div>

                <Button onClick={handlePrint} variant="outline" className="w-full gap-2">
                  <Printer className="w-4 h-4" /> Print Receipt
                </Button>
                <Button onClick={() => { resetAndClose(); setShowFeedbackPopup(true); }} className="w-full gap-2" variant="default">
                  <Star className="w-4 h-4" /> Leave Feedback
                </Button>
                <Button onClick={resetAndClose} variant="ghost" className="w-full">
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Payment Instructions Popup */}
      <Dialog open={showPaymentPopup} onOpenChange={setShowPaymentPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-space">
              <DollarSign className="w-5 h-5 text-primary" />
              Complete Your Payment
            </DialogTitle>
            <DialogDescription>
              Send the total amount to complete your order
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Amount display */}
            {receiptData && (
              <div className="text-center py-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Amount Due</p>
                <p className="text-4xl font-bold text-primary font-space">${receiptData.total.toFixed(2)}</p>
              </div>
            )}

            {/* Payment methods */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Send payment via any of these methods:</p>

              <div className="glass-card p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0070ba]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#0070ba] font-bold text-sm">PP</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">PayPal</p>
                    <p className="text-xs text-muted-foreground select-all">amosclinton196@gmail.com</p>
                  </div>
                </div>

                <div className="border-t border-border" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3d95ce]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#3d95ce] font-bold text-sm">V</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Venmo</p>
                    <p className="text-xs text-muted-foreground select-all">+1 (520) 736-1677</p>
                  </div>
                </div>

                <div className="border-t border-border" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#25D366] font-bold text-sm">CA</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Cash App / Zelle</p>
                    <p className="text-xs text-muted-foreground select-all">+1 (520) 736-1677</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation entry */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Transaction / Confirmation Code *</Label>
                <Input
                  value={transactionCode}
                  onChange={e => setTransactionCode(e.target.value)}
                  placeholder="e.g. TXN-123456789 or PayPal ID"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Additional Notes (optional)</Label>
                <Textarea
                  value={paymentNote}
                  onChange={e => setPaymentNote(e.target.value)}
                  placeholder="Screenshot reference, sender name, etc."
                  rows={2}
                />
              </div>
            </div>

            <Button
              onClick={handlePaymentConfirmation}
              disabled={isConfirmingPayment || !transactionCode.trim()}
              className="w-full gap-2"
              size="lg"
            >
              {isConfirmingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Confirm Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Popup */}
      <Dialog open={showFeedbackPopup} onOpenChange={setShowFeedbackPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-space">
              <Star className="w-5 h-5 text-yellow-400" />
              How was your experience?
            </DialogTitle>
            <DialogDescription>
              Your feedback helps us serve you better
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Star rating */}
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${star <= feedbackRating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {feedbackRating === 1 && "Poor"}
              {feedbackRating === 2 && "Fair"}
              {feedbackRating === 3 && "Good"}
              {feedbackRating === 4 && "Great"}
              {feedbackRating === 5 && "Excellent!"}
            </p>

            <div className="space-y-2">
              <Label>Comment (optional)</Label>
              <Textarea
                value={feedbackComment}
                onChange={e => setFeedbackComment(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={3}
              />
            </div>

            <Button
              onClick={handleSubmitFeedback}
              disabled={isSubmittingFeedback}
              className="w-full gap-2"
              size="lg"
            >
              {isSubmittingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartDrawer;
