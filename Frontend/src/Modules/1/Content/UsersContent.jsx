import React, { useState, useEffect, useRef, useCallback } from "react";
import { Edit, Trash2, UserPlus, Search, X } from "lucide-react";
import InputField from "../../../Components/InputField";

// Generate 50 dummy users
const generateUsers = () => {
  const names = [
    "Rahul Kumar",
    "Priya Sharma",
    "Amit Singh",
    "Sneha Patel",
    "Vijay Gupta",
    "Anjali Verma",
    "Raj Malhotra",
    "Neha Kapoor",
    "Sanjay Reddy",
    "Pooja Joshi",
    "Arjun Mehta",
    "Kavya Nair",
    "Rohit Desai",
    "Divya Iyer",
    "Karan Bhatt",
    "Riya Chopra",
    "Aditya Saxena",
    "Simran Kaur",
    "Manish Agarwal",
    "Tanvi Shah",
    "Nikhil Pillai",
    "Ishita Bansal",
    "Akash Rao",
    "Meera Kulkarni",
    "Varun Sinha",
    "Sakshi Pandey",
    "Harsh Tiwari",
    "Nisha Dubey",
    "Gaurav Mishra",
    "Ananya Roy",
    "Deepak Ghosh",
    "Swati Bose",
    "Vishal Sethi",
    "Megha Chawla",
    "Suresh Yadav",
    "Kritika Khanna",
    "Ashish Jain",
    "Pallavi Menon",
    "Rakesh Thakur",
    "Shruti Das",
    "Mohit Chauhan",
    "Ritu Bhatia",
    "Naveen Kumar",
    "Preeti Ahuja",
    "Sachin Goyal",
    "Madhuri Patil",
    "Tarun Singhal",
    "Aditi Arora",
    "Pankaj Sharma",
    "Sonali Gupta",
  ];

  const roles = ["Admin", "User", "Manager", "Moderator"];
  const statuses = ["Active", "Inactive"];

  return names.map((name, i) => ({
    id: i + 1,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joinDate: new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    )
      .toISOString()
      .split("T")[0],
  }));
};

const CHUNK_SIZE = 5; // Load 10 users at a time

const UsersContent = () => {
  const [allUsers] = useState(generateUsers());
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

  // Apply filters (also handles initial load)
  useEffect(() => {
    console.log("🔄 Filters changed, resetting data...");
    let filtered = allUsers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter((user) => user.joinDate === dateFilter);
    }

    console.log("📊 Filtered users count:", filtered.length);

    filteredUsersRef.current = filtered;
    displayedUsersRef.current = filtered.slice(0, CHUNK_SIZE);

    setFilteredUsers(filtered);
    setDisplayedUsers(filtered.slice(0, CHUNK_SIZE));
    setHasMore(filtered.length > CHUNK_SIZE);

    console.log(
      "✅ Initial display:",
      CHUNK_SIZE,
      "Has more:",
      filtered.length > CHUNK_SIZE
    );
  }, [searchTerm, roleFilter, statusFilter, dateFilter, allUsers]);

  // Load more data
  const loadMoreUsers = useCallback(() => {
    if (isLoading || !hasMore) {
      console.log(
        "⛔ Load blocked - isLoading:",
        isLoading,
        "hasMore:",
        hasMore
      );
      return;
    }

    console.log("📥 Loading more users...");
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const currentDisplayed = displayedUsersRef.current.length;
      const currentFiltered = filteredUsersRef.current;
      const startIndex = currentDisplayed;
      const endIndex = startIndex + CHUNK_SIZE;
      const newUsers = currentFiltered.slice(startIndex, endIndex);

      console.log("📍 Current displayed:", currentDisplayed);
      console.log("📍 Loading from index:", startIndex, "to", endIndex);
      console.log("📍 New users to add:", newUsers.length);
      console.log("📍 Total filtered:", currentFiltered.length);

      if (newUsers.length > 0) {
        setDisplayedUsers((prev) => {
          const updated = [...prev, ...newUsers];
          displayedUsersRef.current = updated;
          console.log("✅ Updated displayed count:", updated.length);
          return updated;
        });
        setHasMore(endIndex < currentFiltered.length);
        console.log(
          "🔄 Has more after load:",
          endIndex < currentFiltered.length
        );
      } else {
        setHasMore(false);
        console.log("🏁 No more users to load");
      }

      setIsLoading(false);
    }, 500);
  }, [isLoading, hasMore]);

  // Infinite scroll observer
  useEffect(() => {
    const scrollContainer = document.querySelector(".user-scroll-container");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("👀 Observer triggered - intersecting!");
          console.log("   hasMore:", hasMore, "isLoading:", isLoading);
          if (hasMore && !isLoading) {
            loadMoreUsers();
          }
        }
      },
      {
        root: scrollContainer,
        rootMargin: "100px", // Load a bit before reaching bottom
        threshold: 0.1,
      }
    );

    const target = observerTarget.current;
    if (target) {
      console.log("👁️ Observer attached to target");
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, isLoading, loadMoreUsers]);

  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    setRoleFilter("");
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
                icon={Search} // icon pass karenge
              />
              {/* <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              /> */}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Manager">Manager</option>
                <option value="Moderator">Moderator</option>
              </select>

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
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Join Date
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
                        {user.name[0]}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {user.joinDate}
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
          <div ref={observerTarget} className="h-4 bg-transparent"></div>

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
