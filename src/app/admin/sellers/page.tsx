// src/app/admin/sellers/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Camera, Star, Package, TrendingUp } from "lucide-react";

interface Seller {
  _id: string;
  name: string;
  email: string;
  photographerProfile: {
    businessName?: string;
    specialties: string[];
    experience: number;
    priceRange: {
      min: number;
      max: number;
      currency: string;
      per: string;
    };
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    serviceAreas: string[];
  };
  isVerified: boolean;
  createdAt: string;
  productCount?: number;
  totalSales?: number;
  totalRevenue?: number;
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [showModal, setShowModal] = useState(false);

  const specialties = [
    "wedding",
    "portrait",
    "event",
    "commercial",
    "fashion",
    "product",
    "real-estate",
  ];

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [sellers, searchTerm, filterStatus, filterSpecialty, sortBy, sortOrder]);

  const fetchSellers = async () => {
    try {
      const res = await fetch("/api/admin/sellers");
      const data = await res.json();

      if (data.success) {
        setSellers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...sellers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (seller) =>
          seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          seller.photographerProfile?.businessName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === "verified") {
      filtered = filtered.filter((s) => s.photographerProfile?.isVerified);
    } else if (filterStatus === "unverified") {
      filtered = filtered.filter((s) => !s.photographerProfile?.isVerified);
    }

    // Specialty filter
    if (filterSpecialty !== "all") {
      filtered = filtered.filter((s) =>
        s.photographerProfile?.specialties?.includes(filterSpecialty)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortBy) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "rating":
          aVal = a.photographerProfile?.rating || 0;
          bVal = b.photographerProfile?.rating || 0;
          break;
        case "experience":
          aVal = a.photographerProfile?.experience || 0;
          bVal = b.photographerProfile?.experience || 0;
          break;
        case "products":
          aVal = a.productCount || 0;
          bVal = b.productCount || 0;
          break;
        case "revenue":
          aVal = a.totalRevenue || 0;
          bVal = b.totalRevenue || 0;
          break;
        case "createdAt":
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredSellers(filtered);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const viewSellerDetails = (seller: Seller) => {
    setSelectedSeller(seller);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg">Loading sellers...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Sellers</h1>
        <p className="text-gray-600 mt-2">
          View and manage all registered photographers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Sellers</p>
          <p className="text-2xl font-bold text-gray-900">{sellers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Verified</p>
          <p className="text-2xl font-bold text-green-600">
            {sellers.filter((s) => s.photographerProfile?.isVerified).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Avg Rating</p>
          <p className="text-2xl font-bold text-yellow-600">
            {(
              sellers.reduce(
                (sum, s) => sum + (s.photographerProfile?.rating || 0),
                0
              ) / sellers.length || 0
            ).toFixed(1)}
            ⭐
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold text-blue-600">
            {sellers.reduce((sum, s) => sum + (s.productCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, email, or business name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="createdAt">Join Date</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
              <option value="products">Products</option>
              <option value="revenue">Revenue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Seller {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialties
                </th>
                <th
                  onClick={() => handleSort("experience")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Experience{" "}
                  {sortBy === "experience" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("rating")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Rating {sortBy === "rating" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price Range
                </th>
                <th
                  onClick={() => handleSort("products")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Products{" "}
                  {sortBy === "products" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No sellers found
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Camera className="text-purple-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {seller.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {seller.photographerProfile?.businessName ||
                              seller.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {seller.photographerProfile?.specialties
                          ?.slice(0, 2)
                          .map((spec) => (
                            <span
                              key={spec}
                              className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded"
                            >
                              {spec}
                            </span>
                          ))}
                        {seller.photographerProfile?.specialties?.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +
                            {seller.photographerProfile.specialties.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {seller.photographerProfile?.experience || 0} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="text-yellow-400 fill-yellow-400" size={16} />
                        <span className="ml-1 text-sm font-medium text-gray-900">
                          {seller.photographerProfile?.rating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="ml-1 text-xs text-gray-500">
                          ({seller.photographerProfile?.reviewCount || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${seller.photographerProfile?.priceRange?.min || 0} - $
                      {seller.photographerProfile?.priceRange?.max || 0}/
                      {seller.photographerProfile?.priceRange?.per || "hour"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {seller.productCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          seller.photographerProfile?.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {seller.photographerProfile?.isVerified
                          ? "Verified"
                          : "Unverified"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => viewSellerDetails(seller)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredSellers.length} of {sellers.length} sellers
      </div>

      {/* Seller Detail Modal */}
      {showModal && selectedSeller && (
        <SellerDetailModal 
          seller={selectedSeller} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}

// Separate modal component for better organization
function SellerDetailModal({ seller, onClose }: { seller: Seller; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Seller Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4 pb-6 border-b">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Camera className="text-purple-600" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{seller.name}</h3>
                <p className="text-gray-600">{seller.email}</p>
                {seller.photographerProfile?.businessName && (
                  <p className="text-sm text-purple-600">
                    {seller.photographerProfile.businessName}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-1">
                  <Star className="text-yellow-400 fill-yellow-400" size={20} />
                  <span className="ml-1 text-lg font-bold">
                    {seller.photographerProfile?.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {seller.photographerProfile?.reviewCount || 0} reviews
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Experience</p>
                <p className="text-lg font-bold text-gray-900">
                  {seller.photographerProfile?.experience || 0} years
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Products</p>
                <p className="text-lg font-bold text-gray-900">
                  {seller.productCount || 0}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Total Sales</p>
                <p className="text-lg font-bold text-gray-900">
                  {seller.totalSales || 0}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Revenue</p>
                <p className="text-lg font-bold text-green-600">
                  ${seller.totalRevenue?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Specialties
                </h4>
                <div className="flex flex-wrap gap-2">
                  {seller.photographerProfile?.specialties?.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Price Range
                </h4>
                <p className="text-gray-900">
                  ${seller.photographerProfile?.priceRange?.min || 0} - $
                  {seller.photographerProfile?.priceRange?.max || 0}{" "}
                  {seller.photographerProfile?.priceRange?.currency || "USD"} per{" "}
                  {seller.photographerProfile?.priceRange?.per || "hour"}
                </p>
              </div>

              {seller.photographerProfile?.serviceAreas?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Service Areas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {seller.photographerProfile.serviceAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Verification Status</p>
                  <p className="font-medium">
                    {seller.photographerProfile?.isVerified ? (
                      <span className="text-green-600">✓ Verified</span>
                    ) : (
                      <span className="text-yellow-600">⚠ Unverified</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}