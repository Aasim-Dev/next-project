// src/app/seller/add-product/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, X, Plus } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "wedding",
    price: "",
    location: "",
    duration: "1",
    deliverables: [""],
    tags: [""],
    status: "active",
  });

  const categories = [
    { value: "wedding", label: "Wedding Photography" },
    { value: "portrait", label: "Portrait Photography" },
    { value: "event", label: "Event Photography" },
    { value: "product", label: "Product Photography" },
    { value: "real-estate", label: "Real Estate Photography" },
    { value: "fashion", label: "Fashion Photography" },
    { value: "commercial", label: "Commercial Photography" },
    { value: "other", label: "Other" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeliverableChange = (index: number, value: string) => {
    const newDeliverables = [...formData.deliverables];
    newDeliverables[index] = value;
    setFormData({ ...formData, deliverables: newDeliverables });
  };

  const addDeliverable = () => {
    setFormData({
      ...formData,
      deliverables: [...formData.deliverables, ""],
    });
  };

  const removeDeliverable = (index: number) => {
    if (formData.deliverables.length > 1) {
      setFormData({
        ...formData,
        deliverables: formData.deliverables.filter((_, i) => i !== index),
      });
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const addTag = () => {
    setFormData({
      ...formData,
      tags: [...formData.tags, ""],
    });
  };

  const removeTag = (index: number) => {
    if (formData.tags.length > 1) {
      setFormData({
        ...formData,
        tags: formData.tags.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty deliverables and tags
      const cleanedData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        deliverables: formData.deliverables.filter(d => d.trim() !== ""),
        tags: formData.tags.filter(t => t.trim() !== ""),
      };

      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Product created successfully!");
        router.push("/seller/products");
      } else {
        alert(data.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">Create a new photography service listing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Professional Wedding Photography Package"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe your photography service in detail..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., New York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Deliverables */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Deliverables</h2>
            <button
              type="button"
              onClick={addDeliverable}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
            >
              <Plus size={20} />
              <span>Add More</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={deliverable}
                  onChange={(e) => handleDeliverableChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., 300+ edited photos"
                />
                {formData.deliverables.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDeliverable(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tags</h2>
            <button
              type="button"
              onClick={addTag}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
            >
              <Plus size={20} />
              <span>Add More</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., outdoor, candid, professional"
                />
                {formData.tags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="active">Active (Visible to buyers)</option>
              <option value="draft">Draft (Not visible)</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/seller/product")}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}