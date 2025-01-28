// import React, { useEffect, useState, useCallback } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Area,
//   AreaChart,
// } from "recharts";
// import {
//   Users,
//   MessageSquare,
//   RefreshCcw,
//   Sun,
//   Mail,
//   TrendingUp,
//   Calendar,
//   ArrowUp,
//   ArrowDown,
// } from "lucide-react";

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalUniqueVisitors: 0,
//     totalVisits: 0,
//     periodStats: {
//       activeVisitors: 0,
//       returningVisitors: 0,
//       uniqueVisitors: 0,
//     },
//     hourlyDistribution: [],
//     subscribers: {
//       total: 0,
//       weekly: 0,
//       monthly: 0,
//       growthRate: 0,
//     },
//   });
//   const [timeRange, setTimeRange] = useState("week");
//   const [loading, setLoading] = useState(true);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [lastMonthUsers, setLastMonthUsers] = useState(0);

//   const fetchStats = useCallback(async () => {
//     try {
//       const response = await fetch(`/api/visits/statistics`);
//       const data = await response.json();

//       const transformedData = {
//         totalUniqueVisitors: data.totalUniqueVisitors || 0,
//         totalVisits: data.totalVisits || 0,
//         periodStats: {
//           activeVisitors: data.periodStats?.activeVisitors || 0,
//           returningVisitors: data.periodStats?.returningVisitors || 0,
//           uniqueVisitors: data.periodStats?.uniqueVisitors || 0,
//         },
//         hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
//           time: `${i}:00`,
//           visits: Math.floor(Math.random() * 100),
//           uniqueVisits: Math.floor(Math.random() * 50),
//         })),
//         subscribers: {
//           total: data.totalUniqueVisitors || 0,
//           weekly: Math.round((data.totalUniqueVisitors || 0) * 0.3),
//           monthly: Math.round((data.totalUniqueVisitors || 0) * 0.7),
//           growthRate: 15.5,
//         },
//       };

//       setStats(transformedData);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching statistics:", error);
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchStats();
//   }, [fetchStats]);

//   const StatCard = ({ title, value, icon: Icon, lastMonth, trend }) => (
//     <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-gray-400 text-sm font-medium uppercase">{title}</h3>
//         <div className="p-2 bg-gray-700/50 rounded-lg">
//           <Icon className="w-5 h-5 text-indigo-400" />
//         </div>
//       </div>
//       <div className="mb-4">
//         <span className="text-3xl font-bold text-white">
//           {value?.toLocaleString()}
//         </span>
//       </div>
//       <div className="flex items-center text-sm">
//         {trend > 0 ? (
//           <ArrowUp className="w-4 h-4 text-emerald-400 mr-1" />
//         ) : (
//           <ArrowDown className="w-4 h-4 text-rose-400 mr-1" />
//         )}
//         <span className="text-gray-400">{lastMonth} Last month</span>
//       </div>
//     </div>
//   );

//   const VisitorChart = () => (
//     <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-gray-400 text-sm font-medium uppercase">
//           Visitor Activity
//         </h3>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => setTimeRange("week")}
//             className={`px-3 py-1 rounded-lg text-sm ${
//               timeRange === "week"
//                 ? "bg-indigo-500 text-white"
//                 : "bg-gray-700 text-gray-300"
//             }`}
//           >
//             Week
//           </button>
//           <button
//             onClick={() => setTimeRange("month")}
//             className={`px-3 py-1 rounded-lg text-sm ${
//               timeRange === "month"
//                 ? "bg-indigo-500 text-white"
//                 : "bg-gray-700 text-gray-300"
//             }`}
//           >
//             Month
//           </button>
//         </div>
//       </div>
//       <div className="h-72">
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart data={stats.hourlyDistribution}>
//             <defs>
//               <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
//                 <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
//               </linearGradient>
//               <linearGradient
//                 id="colorUniqueVisits"
//                 x1="0"
//                 y1="0"
//                 x2="0"
//                 y2="1"
//               >
//                 <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
//                 <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//             <XAxis dataKey="time" stroke="#9ca3af" />
//             <YAxis stroke="#9ca3af" />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "rgba(17, 24, 39, 0.8)",
//                 border: "none",
//                 borderRadius: "8px",
//                 color: "#fff",
//               }}
//             />
//             <Area
//               type="monotone"
//               dataKey="visits"
//               stroke="#6366f1"
//               fillOpacity={1}
//               fill="url(#colorVisits)"
//             />
//             <Area
//               type="monotone"
//               dataKey="uniqueVisits"
//               stroke="#22c55e"
//               fillOpacity={1}
//               fill="url(#colorUniqueVisits)"
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-900 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             title="Total Users"
//             value={totalUsers}
//             icon={Users}
//             lastMonth={lastMonthUsers}
//             trend={15}
//           />
//           <StatCard
//             title="Total Visits"
//             value={stats.totalVisits}
//             icon={MessageSquare}
//             lastMonth={stats.totalVisits}
//             trend={8}
//           />
//           <StatCard
//             title="Unique Visitors"
//             value={stats.totalUniqueVisitors}
//             icon={Users}
//             lastMonth={stats.totalUniqueVisitors}
//             trend={12}
//           />
//           <StatCard
//             title="Returning Visitors"
//             value={stats.periodStats.returningVisitors}
//             icon={RefreshCcw}
//             lastMonth={stats.periodStats.returningVisitors}
//             trend={-5}
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-gray-400 text-sm font-medium uppercase">
//                 Newsletter Growth
//               </h3>
//               <div className="p-2 bg-gray-700/50 rounded-lg">
//                 <Mail className="w-5 h-5 text-indigo-400" />
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div className="bg-gray-800/50 rounded-lg p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Calendar className="w-4 h-4 text-gray-400" />
//                   <span className="text-gray-400 text-sm">This Week</span>
//                 </div>
//                 <span className="text-2xl font-bold text-white">
//                   {stats.subscribers.weekly.toLocaleString()}
//                 </span>
//               </div>
//               <div className="bg-gray-800/50 rounded-lg p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <TrendingUp className="w-4 h-4 text-gray-400" />
//                   <span className="text-gray-400 text-sm">This Month</span>
//                 </div>
//                 <span className="text-2xl font-bold text-white">
//                   {stats.subscribers.monthly.toLocaleString()}
//                 </span>
//               </div>
//             </div>
//             <div className="bg-gray-800/50 rounded-lg p-4">
//               <div className="flex items-center gap-2">
//                 <ArrowUp className="w-4 h-4 text-emerald-400" />
//                 <span className="text-gray-400 text-sm">
//                   {stats.subscribers.growthRate}% Monthly Growth
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className="lg:col-span-2">
//             <VisitorChart />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Users,
  MessageSquare,
  RefreshCcw,
  Sun,
  Mail,
  TrendingUp,
  Calendar,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Video,
  Book,
  UserCircle,
} from "lucide-react";
import backendURL from "../../config";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUniqueVisitors: 0,
    totalVisits: 0,
    periodStats: {
      activeVisitors: 0,
      returningVisitors: 0,
      uniqueVisitors: 0,
    },
    hourlyDistribution: [],
    subscribers: {
      total: 0,
      weekly: 0,
      monthly: 0,
      growthRate: 0,
    },
  });

  const [contentStats, setContentStats] = useState({
    posts: {
      total: 0,
      lastMonth: 0,
      trend: 0,
    },
    videos: {
      total: 0,
      lastMonth: 0,
      trend: 0,
    },
    digitalEditions: {
      total: 0,
      lastMonth: 0,
      trend: 0,
    },
    authors: {
      total: 0,
      lastMonth: 0,
      trend: 0,
    },
  });

  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);

  const fetchStats = useCallback(async () => {
    try {
      const [
        visitsResponse,
        postsResponse,
        videosResponse,
        editionsResponse,
        authorsResponse,
      ] = await Promise.all([
        fetch(`${backendURL}/api/visits/statistics`),
        fetch(`${backendURL}/api/getAllFashion`),
        fetch(`${backendURL}/api/getAllVideos`),
        fetch(`${backendURL}/api/getAllDigitalEditions`),
        fetch(`${backendURL}/api/getAllAuthors`),
      ]);

      const [visitsData, postsData, videosData, editionsData, authorsData] =
        await Promise.all([
          visitsResponse.json(),
          postsResponse.json(),
          videosResponse.json(),
          editionsResponse.json(),
          authorsResponse.json(),
        ]);
      console.log(visitsData);
      const transformedStats = {
        totalUniqueVisitors: visitsData.totalUniqueVisitors || 0,
        totalVisits: visitsData.totalVisits || 0,
        periodStats: {
          activeVisitors: visitsData.periodStats?.activeVisitors || 0,
          returningVisitors: visitsData.periodStats?.returningVisitors || 0,
          uniqueVisitors: visitsData.periodStats?.uniqueVisitors || 0,
        },
        hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          visits: Math.floor(Math.random() * 100),
          uniqueVisits: Math.floor(Math.random() * 50),
        })),
        subscribers: {
          total: visitsData.totalUniqueVisitors || 0,
          weekly: Math.round((visitsData.totalUniqueVisitors || 0) * 0.3),
          monthly: Math.round((visitsData.totalUniqueVisitors || 0) * 0.7),
          growthRate: 15.5,
        },
      };

      const transformedContentStats = {
        posts: {
          total: postsData.total || 0,
          lastMonth: postsData.lastMonth || 0,
          trend: postsData.trend || 0,
        },
        videos: {
          total: videosData.length || 0,
          lastMonth: videosData.lastMonth || 0,
          trend: videosData.trend || 0,
        },
        digitalEditions: {
          total: editionsData.length || 0,
          lastMonth: editionsData.lastMonth || 0,
          trend: editionsData.trend || 0,
        },
        authors: {
          total: authorsData.length || 0,
          lastMonth: authorsData.lastMonth || 0,
          trend: authorsData.trend || 0,
        },
      };

      setStats(transformedStats);
      setContentStats(transformedContentStats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setLoading(false);
    }
  }, []);

  const fetchTotalRegUsers = useCallback(async () => {
    try {
      const res = await fetch(`${backendURL}/api/getUsers`);
      const data = await res.json();

      if (res.ok) {
        // setTotalUsers(data.totalUsers);

        setTotalUsers(data.totalUsers);
        setLastMonthUsers(data.lastMonthUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchTotalRegUsers();
  }, [fetchStats, fetchTotalRegUsers]);

  const StatCard = ({ title, value, icon: Icon, lastMonth, trend }) => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-400 text-sm font-medium uppercase">{title}</h3>
        <div className="p-2 bg-gray-700/50 rounded-lg">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
      </div>
      <div className="mb-4">
        <span className="text-3xl font-bold text-white">
          {value?.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center text-sm">
        {trend > 0 ? (
          <ArrowUp className="w-4 h-4 text-emerald-400 mr-1" />
        ) : (
          <ArrowDown className="w-4 h-4 text-rose-400 mr-1" />
        )}
        <span className="text-gray-400">{lastMonth} Last month</span>
      </div>
    </div>
  );

  const VisitorChart = () => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-400 text-sm font-medium uppercase">
          Visitor Activity
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-3 py-1 rounded-lg text-sm ${
              timeRange === "week"
                ? "bg-indigo-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-3 py-1 rounded-lg text-sm ${
              timeRange === "month"
                ? "bg-indigo-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Month
          </button>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stats.hourlyDistribution}>
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="colorUniqueVisits"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.8)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="visits"
              stroke="#6366f1"
              fillOpacity={1}
              fill="url(#colorVisits)"
            />
            <Area
              type="monotone"
              dataKey="uniqueVisits"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#colorUniqueVisits)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={Users}
            lastMonth={lastMonthUsers}
            trend={15}
          />
          <StatCard
            title="Total Visits"
            value={stats.totalVisits}
            icon={MessageSquare}
            lastMonth={stats.totalVisits}
            trend={8}
          />
          <StatCard
            title="Unique Visitors"
            value={stats.totalUniqueVisitors}
            icon={Users}
            lastMonth={stats.totalUniqueVisitors}
            trend={12}
          />
          <StatCard
            title="Returning Visitors"
            value={stats.periodStats.returningVisitors}
            icon={RefreshCcw}
            lastMonth={stats.periodStats.returningVisitors}
            trend={-5}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Posts"
            value={contentStats.posts.total}
            icon={BookOpen}
            lastMonth={contentStats.posts.lastMonth}
            trend={contentStats.posts.trend}
          />
          <StatCard
            title="Total Videos"
            value={contentStats.videos.total}
            icon={Video}
            lastMonth={contentStats.videos.lastMonth}
            trend={contentStats.videos.trend}
          />
          <StatCard
            title="Digital Editions"
            value={contentStats.digitalEditions.total}
            icon={Book}
            lastMonth={contentStats.digitalEditions.lastMonth}
            trend={contentStats.digitalEditions.trend}
          />
          <StatCard
            title="Authors"
            value={contentStats.authors.total}
            icon={UserCircle}
            lastMonth={contentStats.authors.lastMonth}
            trend={contentStats.authors.trend}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-400 text-sm font-medium uppercase">
                Newsletter Growth
              </h3>
              <div className="p-2 bg-gray-700/50 rounded-lg">
                <Mail className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">This Week</span>
                </div>
                <span className="text-2xl font-bold text-white">
                  {stats.subscribers.weekly.toLocaleString()}
                </span>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">This Month</span>
                </div>
                <span className="text-2xl font-bold text-white">
                  {stats.subscribers.monthly.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <ArrowUp className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-400 text-sm">
                  {stats.subscribers.growthRate}% Monthly Growth
                </span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <VisitorChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
