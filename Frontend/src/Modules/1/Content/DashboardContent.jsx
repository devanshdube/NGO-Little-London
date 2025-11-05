import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Users, BarChart3, FileText, ImageIcon } from "lucide-react";

/**
 * DashboardContent
 *
 * - Shows greeting based on time in Asia/Kolkata
 * - Shows date & day
 * - Fetches counts for Users, Payments, Projects, Gallery
 *
 * APIs used (attempted):
 *  - Users:    /auth/api/ngo/get/getAllUser       (expects res.data.data = array)
 *  - Payments: /auth/api/ngo/get/getAllPayments   (if not present, handled gracefully)
 *  - Projects: /auth/api/ngo/get/getAllProjects   (expects res.data.projects = array)
 *  - Gallery:  /auth/api/ngo/get/getGalleryImages (expects res.data.images = array)
 *
 * If your actual endpoints differ, update the constants below.
 */

const API_USERS = "http://localhost:5555/auth/api/ngo/get/getAllUser";
const API_PAYMENTS = "http://localhost:5555/auth/api/ngo/get/getAllPayments"; // might not exist — handled
const API_PROJECTS = "http://localhost:5555/auth/api/ngo/get/getAllProjects";
const API_GALLERY = "http://localhost:5555/auth/api/ngo/get/getGalleryImages";

function useKolkataDate() {
  // Returns { dateStr: 'Wednesday, Nov 5, 2025', timeStr: '10:34 AM', hour: 10 }
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60 * 1000); // update each minute
    return () => clearInterval(t);
  }, []);

  // format in Asia/Kolkata timezone
  const optsDate = {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  };
  const optsTime = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };
  const optsHour = { hour: "2-digit", hour12: false, timeZone: "Asia/Kolkata" };

  const dateStr = new Intl.DateTimeFormat("en-GB", optsDate).format(now);
  const timeStr = new Intl.DateTimeFormat("en-US", optsTime).format(now);
  const hourStr = new Intl.DateTimeFormat("en-GB", optsHour).format(now); // "00"-"23"
  const hour = Number(hourStr);

  return { dateStr, timeStr, hour };
}

export default function DashboardContent() {
  const { dateStr, timeStr, hour } = useKolkataDate();

  // greeting logic
  const greeting = useMemo(() => {
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Hello";
  }, [hour]);

  const nameFromStorage =
    typeof window !== "undefined"
      ? localStorage.getItem("userName") ||
        localStorage.getItem("name") ||
        "User"
      : "User";
  const displayName = nameFromStorage;

  // stats state
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    users: null,
    payments: null,
    projects: null,
    gallery: null,
  });
  const [errors, setErrors] = useState({
    users: null,
    payments: null,
    projects: null,
    gallery: null,
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // fetch all endpoints concurrently and handle missing endpoints gracefully
    const calls = [
      axios
        .get(API_USERS)
        .then((r) => ({ key: "users", ok: true, res: r }))
        .catch((e) => ({ key: "users", ok: false, err: e })),
      axios
        .get(API_PAYMENTS)
        .then((r) => ({ key: "payments", ok: true, res: r }))
        .catch((e) => ({ key: "payments", ok: false, err: e })),
      axios
        .get(API_PROJECTS)
        .then((r) => ({ key: "projects", ok: true, res: r }))
        .catch((e) => ({ key: "projects", ok: false, err: e })),
      axios
        .get(API_GALLERY)
        .then((r) => ({ key: "gallery", ok: true, res: r }))
        .catch((e) => ({ key: "gallery", ok: false, err: e })),
    ];

    Promise.all(calls)
      .then((results) => {
        if (!isMounted) return;
        const nextCounts = {
          users: null,
          payments: null,
          projects: null,
          gallery: null,
        };
        const nextErrors = {
          users: null,
          payments: null,
          projects: null,
          gallery: null,
        };

        results.forEach((r) => {
          if (!r) return;
          const k = r.key;
          if (!r.ok) {
            // handle error: set readable message
            const msg =
              r.err?.response?.data?.message || r.err?.message || "Failed";
            nextErrors[k] = msg;
            nextCounts[k] = null;
            return;
          }

          const data = r.res?.data;
          // map different API shapes:
          if (k === "users") {
            // try common shapes: { status: "Success", data: [...] } or { users: [...] }
            const arr = Array.isArray(data?.data)
              ? data.data
              : Array.isArray(data?.users)
              ? data.users
              : null;
            nextCounts.users = Array.isArray(arr)
              ? arr.length
              : typeof data?.count === "number"
              ? data.count
              : null;
            if (nextCounts.users === null)
              nextErrors.users = "Unexpected response";
          } else if (k === "payments") {
            // payments may return array or count
            const arrP = Array.isArray(data?.data)
              ? data.data
              : Array.isArray(data?.payments)
              ? data.payments
              : null;
            nextCounts.payments = Array.isArray(arrP)
              ? arrP.length
              : typeof data?.count === "number"
              ? data.count
              : null;
            if (nextCounts.payments === null)
              nextErrors.payments = "No payments API";
          } else if (k === "projects") {
            const arrPr = Array.isArray(data?.projects)
              ? data.projects
              : Array.isArray(data?.data)
              ? data.data
              : null;
            nextCounts.projects = Array.isArray(arrPr)
              ? arrPr.length
              : typeof data?.count === "number"
              ? data.count
              : null;
            if (nextCounts.projects === null)
              nextErrors.projects = "Unexpected response";
          } else if (k === "gallery") {
            const arrG = Array.isArray(data?.images)
              ? data.images
              : Array.isArray(data?.data)
              ? data.data
              : null;
            nextCounts.gallery = Array.isArray(arrG)
              ? arrG.length
              : typeof data?.count === "number"
              ? data.count
              : null;
            if (nextCounts.gallery === null)
              nextErrors.gallery = "Unexpected response";
          }
        });

        setCounts(nextCounts);
        setErrors(nextErrors);
      })
      .catch((e) => {
        // should not happen due to per-call catches, but safe fallback
        console.error("Fetch dashboard data error:", e);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // small helper to render card
  const StatCard = ({
    title,
    value,
    icon,
    colorClass = "bg-blue-100 text-blue-600",
    hint,
    onView,
  }) => (
    <div className="bg-white rounded-lg shadow p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            {value ?? (loading ? "…" : "—")}
          </p>
        </div>
        <div
          className={`w-12 h-12 ${colorClass
            .split(" ")
            .slice(0, 2)
            .join(" ")} rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">{hint}</div>
        <div>
          {onView && (
            <button
              onClick={onView}
              className="px-3 py-1 bg-indigo-600 text-white rounded text-xs"
            >
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500">Welcome back</div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {greeting}, <span className="text-indigo-600">{displayName}</span>
            </h1>
            <div className="text-sm text-gray-500">
              • {timeStr} (Asia/Kolkata)
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-1">{dateStr}</div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="text-xs text-gray-500 text-right">
            <div>Quick overview</div>
            <div className="text-sm font-medium text-gray-800">
              {counts.users ?? "—"} users
            </div>
          </div>
          <div>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Users"
          value={counts.users}
          icon={<Users size={20} />}
          colorClass="bg-blue-100 text-blue-600"
          hint={
            errors.users ? `Error: ${errors.users}` : "Total registered users"
          }
          onView={() => (window.location.href = "/users")}
        />

        <StatCard
          title="Payments"
          value={counts.payments}
          icon={<BarChart3 size={20} />}
          colorClass="bg-green-100 text-green-600"
          hint={
            errors.payments
              ? `Error: ${errors.payments}`
              : "Total recorded payments"
          }
          onView={() => (window.location.href = "/payments")}
        />

        <StatCard
          title="Projects"
          value={counts.projects}
          icon={<FileText size={20} />}
          colorClass="bg-purple-100 text-purple-600"
          hint={
            errors.projects
              ? `Error: ${errors.projects}`
              : "Active projects & entries"
          }
          onView={() => (window.location.href = "/projects")}
        />

        <StatCard
          title="Gallery"
          value={counts.gallery}
          icon={<ImageIcon size={20} />}
          colorClass="bg-rose-100 text-rose-600"
          hint={errors.gallery ? `Error: ${errors.gallery}` : "Uploaded images"}
          onView={() => (window.location.href = "/gallery")}
        />
      </div>

      {/* Recent Activity (kept simple) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>

        {/* If you have an activity API, you can fetch and map here.
            For now we show lightweight placeholders. */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
              U
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">
                New user registered
              </div>
              <div className="text-xs text-gray-500">
                John Doe — 20 minutes ago
              </div>
            </div>
            <div className="text-xs text-gray-400">Now</div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
              P
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">
                Payment received
              </div>
              <div className="text-xs text-gray-500">
                ₹2,500 — Invoice #452 — 2 hours ago
              </div>
            </div>
            <div className="text-xs text-gray-400">2h</div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              G
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">
                3 images uploaded to gallery
              </div>
              <div className="text-xs text-gray-500">Today</div>
            </div>
            <div className="text-xs text-gray-400">4h</div>
          </div>
        </div>
      </div>
    </div>
  );
}
