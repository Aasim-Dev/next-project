// src/app/seller/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  location: string;
  duration: number;
  isActive: boolean;
  createdAt: string;
  images?: { url: string }[];
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/product?sellerId=${user.id}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          isActive: !currentStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProducts(products.map(p => 
          p._id === productId ? { ...p, isActive: !currentStatus } : p
        ));
      } else {
        alert(data.error || "Failed to update product status");
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
      alert("Failed to update product status");
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const res = await fetch(`/api/product?productId=${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p._id !== productId));
        alert("Product deleted successfully");
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
  };

  const activeProducts = products.filter(p => p.isActive).length;
  const totalRevenue = 0; // TODO: Calculate from orders

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
          <p className="text-blue-600 text-sm font-medium mb-1">Average Price</p>
          <p className="text-3xl font-bold text-gray-900">
            ${products.length > 0 
              ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(0)
              : 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">Across all products</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <p className="text-green-600 text-sm font-medium mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">From completed orders</p>
        </div>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">📸</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No products yet</h2>
          <p className="text-gray-500 text-lg mb-6">
            Create your first product to start selling
          </p>
          <Link
            href="/seller/add-product"
            className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
            <span>Create Your First Product</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">
                            {product.images && product.images.length > 0 
                              ? product.images[0].url 
                              : "📸"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.title}</p>
                          <p className="text-sm text-gray-500">
                            Added {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">${product.price}</td>
                    <td className="px-6 py-4 text-gray-700">{product.duration}h</td>
                    <td className="px-6 py-4">
                      {product.isActive ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleStatus(product._id, product.isActive)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title={product.isActive ? "Deactivate" : "Activate"}
                        >
                          {product.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <Link
                          href={`/seller/products/${product._id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => deleteProduct(product._id)}
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
        </div>
      )}
    </div>
  );
}