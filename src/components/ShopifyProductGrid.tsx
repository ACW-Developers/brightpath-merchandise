import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopifyProduct, storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export const ShopifyProductGrid = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const isCartLoading = useCartStore(state => state.isLoading);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 20 });
        if (data?.data?.products?.edges) {
          setProducts(data.data.products.edges);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart!", {
      description: product.node.title,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-2xl font-bold font-space mb-2">No products yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Our merchandise store is being set up. Check back soon for amazing BrightPath branded merchandise!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const image = product.node.images.edges[0]?.node;
        const price = product.node.priceRange.minVariantPrice;
        return (
          <div
            key={product.node.id}
            className="glass-card group overflow-hidden hover:scale-[1.02] transition-all duration-500"
          >
            <Link to={`/product/${product.node.handle}`}>
              <div className="relative h-56 overflow-hidden">
                {image ? (
                  <img
                    src={image.url}
                    alt={image.altText || product.node.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
            </Link>
            <div className="p-5">
              <Link to={`/product/${product.node.handle}`}>
                <h3 className="font-bold font-space mb-1 text-foreground group-hover:text-primary transition-colors truncate">
                  {product.node.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.node.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold gradient-text">
                  {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={isCartLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isCartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingCart className="w-4 h-4 mr-1" />Add</>}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
