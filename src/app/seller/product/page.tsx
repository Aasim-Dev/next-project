// app/seller/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  sales: number;
  revenue: number;
  status: "active" | "draft" | "inactive";
  image: string;
  createdAt: string;
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
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
          category: "wedding",
          price: 1200,
          sales: 32,
          revenue: 38400,
          status: "active",
          image: "📸",
          createdAt: "2025-01-15"
        },
        {
          id: "2",
          title: "Portrait Session - Premium",
          category: "portrait",
          price: 450,
          sales: 28,
          revenue: 12600,
          status: "active",
          image: "🎭",
          createdAt: "2025-02-10"
        },
        {
          id: "3",
          title: "Corporate Event Photography",
          category: "event",
          price: 800,
          sales: 18,
          revenue: 14400,
          status: "active",
          image: "🎉",
          createdAt: "2025-03-05"
        },
        {
          id: "4",
          title: "Family Portrait Package",
          category: "portrait",
          price: 350,
          sales: 0,
          revenue: 0,
          status: "draft",
          image: "👨‍👩‍👧‍👦",
          createdAt: "2025-05-28"
        },
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, status: p.status === "active" ? "inactive" : "active" as any }
        : p
    ));
  };

  const deleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
  const activeProducts = products.filter(p => p.status === "active").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-2">
            Manage your photography services and packages
          </p>
        </div>
        <Link
          href="/seller/add-product"
          className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <p className="text-purple-600 text-sm font-medium mb-1">Total Products</p>
          <p className="text-3xl font-bold text-gray-900">{products.length}</p>
          <p className="text-sm text-gray-600 mt-1">{activeProducts} active</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium mb-1">Total Sales</p>
          <p className="text-3xl font-bold text-gray-900">{totalSales}</p>
          <p className="text-sm text-gray-600 mt-1">Across all products</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <p className="text-green-600 text-sm font-medium mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Lifetime earnings</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sales</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Revenue</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{product.image}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.title}</p>
                      <p className="text-sm text-gray-500">Added {new Date(product.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium capitalize">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">${product.price}</td>
                <td className="px-6 py-4 text-gray-700">{product.sales}</td>
                <td className="px-6 py-4 font-semibold text-green-600">${product.revenue.toLocaleString()}</td>
                <td className="px-6 py-4">
                  {product.status === "active" && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
                  )}
                  {product.status === "draft" && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Draft</span>
                  )}
                  {product.status === "inactive" && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleStatus(product.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title={product.status === "active" ? "Deactivate" : "Activate"}
                    >
                      {product.status === "active" ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <Link
                      href={`/seller/products/${product.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg mb-4">No products yet</p>
          <Link
            href="/seller/add-product"
            className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
            <span>Create Your First Product</span>
          </Link>
        </div>
      )}
    </div>
  );
}