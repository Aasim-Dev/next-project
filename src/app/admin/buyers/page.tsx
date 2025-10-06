"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Eye, Ban, CheckCircle, Mail, Calendar, MapPin } from "lucide-react";

interface Buyer {
  _id: string;
  name: string;
  email: string;
  profile: {
    phone?: string;
    location?: string;
    bio?: string;
  };
  isVerified: boolean;
  createdAt: string;
  orderCount?: number;
  totalSpent?: number;
}

export default function AdminBuyers() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [filteredBuyers, setFilteredBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBuyers();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [buyers, searchTerm, filterStatus, sortBy, sortOrder]);

  const fetchBuyers = async () => {
    try {
      const res = await fetch("/api/admin/buyers");
      const data = await res.json();
      
      if (data.success) {
        setBuyers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch buyers:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...buyers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (buyer) =>
          buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          buyer.profile?.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === "verified") {
      filtered = filtered.filter((buyer) => buyer.isVerified);
    } else if (filterStatus === "unverified") {
      filtered = filtered.filter((buyer) => !buyer.isVerified);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortBy) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "email":
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case "createdAt":
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case "orders":
          aVal = a.orderCount || 0;
          bVal = b.orderCount || 0;
          break;
        case "spent":
          aVal = a.totalSpent || 0;
          bVal = b.totalSpent || 0;
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

    setFilteredBuyers(filtered);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const viewBuyerDetails = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg">Loading buyers...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Buyers</h1>
        <p className="text-gray-600 mt-2">View and manage all registered buyers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Buyers</p>
          <p className="text-2xl font-bold text-gray-900">{buyers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Verified</p>
          <p className="text-2xl font-bold text-green-600">
            {buyers.filter((b) => b.isVerified).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Unverified</p>
          <p className="text-2xl font-bold text-yellow-600">
            {buyers.filter((b) => !b.isVerified).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-blue-600">
            {
              buyers.filter(
                (b) =>
                  new Date(b.createdAt).getMonth() === new Date().getMonth()
              ).length
            }
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Join Date</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="orders">Orders</option>
              <option value="spent">Total Spent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buyers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Buyer {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  onClick={() => handleSort("orders")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Orders {sortBy === "orders" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("createdAt")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Joined {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBuyers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No buyers found
                  </td>
                </tr>
              ) : (
                filteredBuyers.map((buyer) => (
                  <tr key={buyer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {buyer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {buyer.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{buyer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {buyer.profile?.location || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          buyer.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {buyer.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {buyer.orderCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(buyer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => viewBuyerDetails(buyer)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
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
        Showing {filteredBuyers.length} of {buyers.length} buyers
      </div>

      {/* Buyer Detail Modal */}
      {showModal && selectedBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Buyer Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-2xl">
                      {selectedBuyer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedBuyer.name}</h3>
                    <p className="text-gray-600">{selectedBuyer.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium">
                      {selectedBuyer.isVerified ? (
                        <span className="text-green-600">✓ Verified</span>
                      ) : (
                        <span className="text-yellow-600">⚠ Unverified</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">
                      {new Date(selectedBuyer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="font-medium">{selectedBuyer.orderCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="font-medium">
                      ${selectedBuyer.totalSpent?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">
                      {selectedBuyer.profile?.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">
                      {selectedBuyer.profile?.location || "N/A"}
                    </p>
                  </div>
                </div>

                {selectedBuyer.profile?.bio && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Bio</p>
                    <p className="text-gray-800">{selectedBuyer.profile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}