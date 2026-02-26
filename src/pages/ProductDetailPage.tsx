import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { storefrontApiRequest, STOREFRONT_PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore, ShopifyProduct } from "@/stores/cartStore";
import { toast } from "sonner";

const ProductDetailPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const isCartLoading = useCartStore(state => state.isLoading);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle });
        if (data?.data?.productByHandle) {
          setProduct(data.data.productByHandle);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (handle) fetchProduct();
  }, [handle]);

  const handleAddToCart = async () => {
    if (!product) return;
    const variant = product.variants.edges[selectedVariantIndex]?.node;
    if (!variant) return;
    
    const shopifyProduct: ShopifyProduct = { node: product };
    await addItem({
      product: shopifyProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart!", { description: `${product.title} x${quantity}` });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex flex-col items-center justify-center py-40">
          <h1 className="text-3xl font-bold font-space mb-4">Product not found</h1>
          <Link to="/">
            <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to Shop</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const images = product.images.edges;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="glass-card overflow-hidden rounded-2xl aspect-square">
                {images[selectedImage]?.node ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                    <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        i === selectedImage ? 'border-primary' : 'border-border/50 hover:border-primary/50'
                      }`}
                    >
                      <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-space mb-3">{product.title}</h1>
                <p className="text-2xl font-bold gradient-text">
                  {selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount || "0").toFixed(2)}
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Options */}
              {product.options?.filter(o => o.name !== "Title").map((option) => (
                <div key={option.name} className="space-y-3">
                  <h3 className="font-semibold font-space">{option.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const variantIndex = product.variants.edges.findIndex(
                        v => v.node.selectedOptions.some(o => o.name === option.name && o.value === value)
                      );
                      const isSelected = selectedVariant?.selectedOptions.some(
                        o => o.name === option.name && o.value === value
                      );
                      return (
                        <button
                          key={value}
                          onClick={() => variantIndex >= 0 && setSelectedVariantIndex(variantIndex)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                            isSelected
                              ? 'border-primary bg-primary/20 text-primary'
                              : 'border-border/50 hover:border-primary/50 text-foreground'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="space-y-3">
                <h3 className="font-semibold font-space">Quantity</h3>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                onClick={handleAddToCart}
                disabled={isCartLoading || !selectedVariant?.availableForSale}
              >
                {isCartLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : !selectedVariant?.availableForSale ? (
                  "Sold Out"
                ) : (
                  <><ShoppingCart className="w-5 h-5 mr-2" />Add to Cart</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
