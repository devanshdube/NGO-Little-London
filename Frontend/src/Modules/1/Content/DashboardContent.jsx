import React from "react";
import { Users, BarChart3, FileText } from "lucide-react";

const DashboardContent = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">2,543</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-green-500 text-sm mt-4">↑ 12% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">₹45.2K</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-green-500 text-sm mt-4">↑ 8% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Documents</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">1,234</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-red-500 text-sm mt-4">↓ 3% from last month</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {i}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Activity Title {i}</p>
                <p className="text-sm text-gray-500">Description of activity</p>
              </div>
              <span className="text-sm text-gray-400">2h ago</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
