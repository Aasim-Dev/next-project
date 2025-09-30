// app/buyer/marketplace/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Star, MapPin, DollarSign, ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  title: string;
  seller: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  location: string;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // TODO: Replace with actual API call
      const mockProducts: Product[] = [
        {
          id: "1",
          title: "Professional Wedding Photography Package",
          seller: "John Photography",
          price: 1200,
          rating: 4.9,
          reviews: 45,
          category: "wedding",
          image: "📸",
          location: "New York, NY"
        },
        {
          id: "2",
          title: "Portrait Photography Session - Premium",
          seller: "Sarah Studios",
          price: 450,
          rating: 4.8,
          reviews: 32,
          category: "portrait",
          image: "🎭",
          location: "Los Angeles, CA"
        },
        {
          id: "3",
          title: "Corporate Event Photography",
          seller: "Mike Captures",
          price: 800,
          rating: 4.7,
          reviews: 28,
          category: "event",
          image: "🎉",
          location: "Chicago, IL"
        },
        {
          id: "4",
          title: "Product Photography Package",
          seller: "Emma Visuals",
          price: 350,
          rating: 4.9,
          reviews: 51,
          category: "product",
          image: "📦",
          location: "San Francisco, CA"
        },
        {
          id: "5",
          title: "Real Estate Photography",
          seller: "David Lens",
          price: 280,
          rating: 4.6,
          reviews: 19,
          category: "real-estate",
          image: "🏠",
          location: "Miami, FL"
        },
        {
          id: "6",
          title: "Fashion Photography Shoot",
          seller: "Lisa Frame",
          price: 950,
          rating: 5.0,
          reviews: 42,
          category: "fashion",
          image: "👗",
          location: "New York, NY"
        },
      ];
      
      setProducts(mockProducts);
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
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (productId: string) => {
    // TODO: Implement add to cart functionality
    alert(`Product ${productId} added to cart!`);
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
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (id: string) => void }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      {/* Product Image */}
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <span className="text-6xl">{product.image}</span>
      </div>

      {/* Product Details */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3">by {product.seller}</p>

        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.reviews})</span>
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
            onClick={() => onAddToCart(product.id)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}