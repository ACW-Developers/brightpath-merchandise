
-- Create product reviews table
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
ON public.product_reviews FOR SELECT
USING (true);

-- Anyone can create reviews (after purchase verification happens in app)
CREATE POLICY "Anyone can create reviews"
ON public.product_reviews FOR INSERT
WITH CHECK (true);

-- Admins can manage reviews
CREATE POLICY "Admins can manage reviews"
ON public.product_reviews FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Add admin update policy for orders (needed for payment confirmation)
CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
USING (public.is_admin());
