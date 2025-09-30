// src/app/buyer/marketplace/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Star, MapPin, DollarSign, ShoppingCart } from "lucide-react";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: { url: string }[];
  location: string;
  rating: number;
  reviewCount: number;
  seller: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "wedding", label: "Wedding" },
    { value: "portrait", label: "Portrait" },
    { value: "event", label: "Event" },
    { value: "product", label: "Product" },
    { value: "real-estate", label: "Real Estate" },
    { value: "fashion", label: "Fashion" },
    { value: "commercial", label: "Commercial" },
  ];

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Product added to cart successfully!');
      } else {
        alert(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-gray-600 mt-2">
          Discover and hire professional photographers for your projects
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products or sellers..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
            isAdding={addingToCart === product._id}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAddToCart, isAdding }: { 
  product: Product; 
  onAddToCart: (id: string) => void;
  isAdding: boolean;
}) {
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].url 
    : '/placeholder-image.jpg';

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      {/* Product Image */}
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
        {imageUrl !== '/placeholder-image.jpg' ? (
          <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">📸</span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3">by {product.seller.name}</p>

        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span className="text-sm font-medium text-gray-700">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({product.reviewCount})</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <MapPin size={14} />
            <span className="text-xs">{product.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <DollarSign className="text-green-600" size={20} />
            <span className="text-2xl font-bold text-gray-900">{product.price}</span>
          </div>
          <button
            onClick={() => onAddToCart(product._id)}
            disabled={isAdding}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            <ShoppingCart size={18} />
            <span>{isAdding ? 'Adding...' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}