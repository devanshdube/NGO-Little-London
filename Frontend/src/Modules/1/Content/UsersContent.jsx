import React, { useState, useEffect, useRef, useCallback } from "react";
import { Edit, Trash2, UserPlus, Search, X } from "lucide-react";
import InputField from "../../../Components/InputField";
import axios from "axios";

const API_URL = "http://localhost:5555/auth/api/ngo/get/getAllUser";
const CHUNK_SIZE = 5;

const UsersContent = () => {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const observerTarget = useRef(null);
  const filteredUsersRef = useRef([]);
  const displayedUsersRef = useRef([]);

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  // fetchUsers stable with empty deps so useEffect won't loop
  const fetchUsers = useCallback(async () => {
    try {
      setIsFetching(true);
      setError(null);
      const res = await axios.get(API_URL, { timeout: 15000 });
      if (res?.data?.status === "Success" && Array.isArray(res.data.data)) {
        const getAllUsers = res.data.data.map((p) => ({
          ...p,
          // ensure createdDate is just yyyy-mm-dd for easier filtering
          createdDate: p.created_at ? p.created_at.slice(0, 10) : null,
        }));
        setUsers(getAllUsers);
      } else {
        setError("API returned unexpected data.");
        setUsers([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err?.response?.data?.message || err.message || "Network error");
      setUsers([]);
    } finally {
      setIsFetching(false);
    }
  }, []); // <-- important: stable function

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Apply filters and reset displayed chunk
  useEffect(() => {
    let filtered = users.slice();

    // Search filter (name, mobile, email)
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const name = String(p.name || "").toLowerCase();
        const mobile = String(p.mobile || "").toLowerCase();
        const email = String(p.email || "").toLowerCase();
        return name.includes(q) || mobile.includes(q) || email.includes(q);
      });
    }

    // Status filter (case-insensitive)
    if (statusFilter) {
      const sf = statusFilter.toLowerCase();
      filtered = filtered.filter(
        (user) => String(user.status || "").toLowerCase() === sf
      );
    }

    // Date filter (compare createdDate which is yyyy-mm-dd)
    if (dateFilter) {
      filtered = filtered.filter((user) => user.createdDate === dateFilter);
    }

    filteredUsersRef.current = filtered;
    displayedUsersRef.current = filtered.slice(0, CHUNK_SIZE);

    setFilteredUsers(filtered);
    setDisplayedUsers(filtered.slice(0, CHUNK_SIZE));
    setHasMore(filtered.length > CHUNK_SIZE);
  }, [users, searchTerm, statusFilter, dateFilter]);

  // Load more data (append next chunk)
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    setTimeout(() => {
      const currentLen = displayedUsersRef.current.length;
      const nextChunk = filteredUsersRef.current.slice(
        currentLen,
        currentLen + CHUNK_SIZE
      );
      if (nextChunk.length > 0) {
        const updated = [...displayedUsersRef.current, ...nextChunk];
        displayedUsersRef.current = updated;
        setDisplayedUsers(updated);
        setHasMore(updated.length < filteredUsersRef.current.length);
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    }, 350);
  }, [isLoading, hasMore]);

  // Infinite scroll observer
  useEffect(() => {
    const scrollContainer = document.querySelector(".user-scroll-container");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (hasMore && !isLoading) loadMore();
        }
      },
      { root: scrollContainer, rootMargin: "150px", threshold: 0.1 }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasMore, isLoading, loadMore]);

  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateFilter("");
  };

  const hasActiveFilters =
    searchTerm || roleFilter || statusFilter || dateFilter;

  return (
    <>
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">All Users</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <UserPlus size={20} />
              Add User
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Box */}
            <div className="relative">
              <InputField
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <X size={18} />
                  Reset
                </button>
              )}

              <span className="text-sm text-gray-600 ml-auto">
                Showing {displayedUsers.length} of {filteredUsers.length} users
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          className="overflow-x-auto user-scroll-container"
          style={{ maxHeight: "450px", overflowY: "auto" }}
        >
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  DOB
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aadhar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {displayedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                        {user.name?.[0] || "U"}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {user.mobile}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {user.email}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {user.designation}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {user.dob}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {user.aadhar}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {user.address}, {user.city}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        String(user.status || "").toLowerCase() === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {user.user_profile ? (
                      <a
                        href={user.user_profile}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <img
                          src={user.user_profile}
                          alt="profile"
                          className="w-14 h-10 object-cover rounded border"
                        />
                        <span className="text-xs text-blue-600">View</span>
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit size={18} />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          )}

          {/* Intersection observer target */}
          <div ref={observerTarget} className="h-4 bg-transparent" />

          {/* End of results message */}
          {!hasMore && displayedUsers.length > 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No more users to load
            </div>
          )}

          {/* No results message */}
          {displayedUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your filters
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UsersContent;
