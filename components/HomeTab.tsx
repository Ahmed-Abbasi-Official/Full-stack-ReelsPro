// "use client"

// import { useMemo } from "react"
// import { Area, AreaChart, CartesianGrid, Pie, PieChart, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, Cell } from "recharts"
// import { Eye, Heart, MessageSquare,  Share2,  Video } from 'lucide-react'

// type KPI = {
//   label: string
//   value: string
//   change: string
//   trend: "up" | "down" | "neutral"
// //   icon: JSX.Element
//   data: { x: string; y: number }[]
//   color: string
// }

// function Sparkline({ data, color, id }: { data: { x: string; y: number }[]; color: string; id: string }) {
//   const gradientId = `spark-${id}`
//   return (
//     <div className="h-12 w-full">
//       <ResponsiveContainer width="100%" height="100%">
//         <AreaChart data={data} margin={{ top: 8, bottom: 0, left: 0, right: 0 }}>
//           <defs>
//             <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor={color} stopOpacity={0.35} />
//               <stop offset="100%" stopColor={color} stopOpacity={0} />
//             </linearGradient>
//           </defs>
//           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(240 5% 84% / 0.35)" />
//           <XAxis dataKey="x" hide />
//           <YAxis hide />
//           <ReTooltip cursor={false} contentStyle={{ borderRadius: 8 }} />
//           <Area
//             type="monotone"
//             dataKey="y"
//             stroke={color}
//             fill={`url(#${gradientId})`}
//             strokeWidth={2}
//             dot={false}
//             activeDot={{ r: 3 }}
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// function Gauge({ value, label }: { value: number; label: string }) {
//   const clamped = Math.max(0, Math.min(100, value))
//   return (
//     <div className="relative flex items-center justify-center">
//       <div
//         className="h-40 w-40 rounded-full"
//         style={{
//           background: `conic-gradient(#7C3AED ${clamped * 3.6}deg, rgba(124,58,237,0.15) ${clamped * 3.6}deg)`,
//         }}
//         aria-label={`${label} ${value}%`}
//         role="img"
//       />
//       <div className="absolute flex h-32 w-32 flex-col items-center justify-center rounded-full border border-white/50 bg-white/70 backdrop-blur">
//         <div className="text-3xl font-semibold text-slate-900">{value}%</div>
//         <div className="text-xs text-slate-600">{label}</div>
//       </div>
//     </div>
//   )
// }

// export default function ReelDashboard() {
//   const kpis: KPI[] = useMemo(() => {
//     const days = ["M", "T", "W", "T", "F", "S", "S"]
//     const rand = (seed: number) => days.map((d, i) => ({ x: d, y: Math.round(50 + Math.sin(i + seed) * 25 + i * 4) }))
//     return [
//       {
//         label: "Uploads",
//         value: "128",
//         change: "+12%",
//         trend: "up",
//         icon: <Video className="h-5 w-5 text-indigo-600" />,
//         data: rand(0.2),
//         color: "#6366F1",
//       },
//       {
//         label: "Views",
//         value: "1.8M",
//         change: "+9%",
//         trend: "up",
//         icon: <Eye className="h-5 w-5 text-purple-600" />,
//         data: rand(0.6).map((d) => ({ ...d, y: d.y + 40 })),
//         color: "#8B5CF6",
//       },
//       {
//         label: "Likes",
//         value: "245K",
//         change: "+6%",
//         trend: "up",
//         icon: <Heart className="h-5 w-5 text-pink-600" />,
//         data: rand(1.4),
//         color: "#EC4899",
//       },
//       {
//         label: "Shares",
//         value: "32.1K",
//         change: "+4%",
//         trend: "up",
//         icon: <Share2 className="h-5 w-5 text-blue-600" />,
//         data: rand(0.9),
//         color: "#2563EB",
//       },
//     ]
//   }, [])

//   const engagementSeries = [
//     { day: "Mon", likes: 3200, comments: 540, shares: 870 },
//     { day: "Tue", likes: 4100, comments: 620, shares: 920 },
//     { day: "Wed", likes: 3800, comments: 580, shares: 880 },
//     { day: "Thu", likes: 4600, comments: 720, shares: 1040 },
//     { day: "Fri", likes: 5200, comments: 810, shares: 1200 },
//     { day: "Sat", likes: 6100, comments: 940, shares: 1380 },
//     { day: "Sun", likes: 5700, comments: 880, shares: 1310 },
//   ]

//   const audienceData = [
//     { name: "18-24", value: 36, color: "#6366F1" },
//     { name: "25-34", value: 42, color: "#8B5CF6" },
//     { name: "35-44", value: 14, color: "#EC4899" },
//     { name: "45+", value: 8, color: "#2563EB" },
//   ]

//   const recentUploads = [
//     {
//       id: "RPL-1293",
//       title: "Street Style Transition",
//       date: "2025-08-01",
//       views: 120_450,
//       likes: 9_340,
//       comments: 1_230,
//     },
//     {
//       id: "RPL-1292",
//       title: "Mini Travel Vlog",
//       date: "2025-07-30",
//       views: 97_220,
//       likes: 7_880,
//       comments: 960,
//     },
//     {
//       id: "RPL-1291",
//       title: "Ramen Recipe ASMR",
//       date: "2025-07-29",
//       views: 84_910,
//       likes: 8_120,
//       comments: 1_110,
//     },
//     {
//       id: "RPL-1290",
//       title: "Morning Routine 2025",
//       date: "2025-07-28",
//       views: 72_340,
//       likes: 5_640,
//       comments: 720,
//     },
//   ]

//   return (
//     <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8">
//       {/* Header */}
//       <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div className="flex items-center gap-3">
//           <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
//             <Video className="h-5 w-5" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Reel Pro Analytics</h1>
//             <p className="text-sm text-slate-600">Focused, fast insights with a distinct aurora style.</p>
//           </div>
//         </div>
//       </header>

//       {/* KPI grid (4) */}
//       <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {kpis.map((kpi, idx) => (
//           <div
//             key={kpi.label}
//             className="group relative overflow-hidden rounded-xl border border-white/60 bg-white/70 p-4 backdrop-blur transition-transform duration-200 hover:-translate-y-0.5">
//             <div
//               className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full"
//               style={{ background: `radial-gradient(${kpi.color}22, transparent 60%)` }}
//               aria-hidden="true"
//             />
//             <div className="mb-2 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 {/* {kpi.icon} */}
//                 <span className="text-sm font-medium text-slate-700">{kpi.label}</span>
//               </div>
//               <span
//                 className={`text-xs ${
//                   kpi.trend === "up" ? "text-emerald-600" : kpi.trend === "down" ? "text-rose-600" : "text-slate-500"
//                 }`}>
//                 {kpi.change}
//               </span>
//             </div>
//             <div className="mb-1 text-2xl font-semibold text-slate-900">{kpi.value}</div>
//             <Sparkline data={kpi.data} color={kpi.color} id={`${idx}`} />
//           </div>
//         ))}
//       </section>

//       {/* Main row: Overview chart + Gauge */}
//       <section className="grid gap-6 lg:grid-cols-3">
//         <div className="relative overflow-hidden rounded-xl border border-white/60 bg-white/70 backdrop-blur lg:col-span-2">
//           <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-400/40 to-indigo-400/40 blur-3xl" aria-hidden="true" />
//           <div className="flex items-center justify-between p-4">
//             <div>
//               <h2 className="text-base font-semibold text-slate-900">Engagement Overview</h2>
//               <p className="text-sm text-slate-600">Likes, comments, and shares over the last 7 days</p>
//             </div>
//             <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-700">Stable</span>
//           </div>
//           <div className="h-[260px] w-full px-2 pb-4">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={engagementSeries} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
//                 <defs>
//                   <linearGradient id="likes-grad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#6366F1" stopOpacity={0.35} />
//                     <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient id="comments-grad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#EC4899" stopOpacity={0.35} />
//                     <stop offset="100%" stopColor="#EC4899" stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient id="shares-grad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
//                     <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(240 5% 84% / 0.5)" />
//                 <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
//                 <YAxis tickLine={false} axisLine={false} tickCount={4} />
//                 <ReTooltip cursor={false} contentStyle={{ borderRadius: 8 }} />
//                 <Area type="natural" dataKey="likes" stroke="#6366F1" fill="url(#likes-grad)" strokeWidth={2} />
//                 <Area type="natural" dataKey="comments" stroke="#EC4899" fill="url(#comments-grad)" strokeWidth={2} />
//                 <Area type="natural" dataKey="shares" stroke="#2563EB" fill="url(#shares-grad)" strokeWidth={2} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="rounded-xl border border-white/60 bg-white/70 p-4 backdrop-blur">
//           <h2 className="text-base font-semibold text-slate-900">Engagement Score</h2>
//           <p className="text-sm text-slate-600">Overall interactions vs. reach</p>
//           <div className="mt-4 flex flex-col items-center gap-4">
//             <Gauge value={87} label="Engagement" />
//             <div className="grid w-full grid-cols-3 gap-2 text-center">
//               <div>
//                 <div className="text-xs text-slate-500">Likes</div>
//                 <div className="text-sm font-semibold text-slate-900">+6%</div>
//               </div>
//               <div>
//                 <div className="text-xs text-slate-500">Comments</div>
//                 <div className="text-sm font-semibold text-slate-900">+3%</div>
//               </div>
//               <div>
//                 <div className="text-xs text-slate-500">Shares</div>
//                 <div className="text-sm font-semibold text-slate-900">+4%</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Compact: Audience donut + Recent uploads list */}
//       <section className="grid gap-6 lg:grid-cols-3">
//         <div className="rounded-xl border border-white/60 bg-white/70 p-4 backdrop-blur">
//           <h2 className="text-base font-semibold text-slate-900">Audience by Age</h2>
//           <p className="text-sm text-slate-600">Viewer distribution</p>
//           <div className="mt-2 h-[240px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <ReTooltip contentStyle={{ borderRadius: 8 }} />
//                 <Pie data={audienceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4}>
//                   {audienceData.map((entry, i) => (
//                     <Cell key={entry.name + i} fill={entry.color} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="lg:col-span-2 rounded-xl border border-white/60 bg-white/70 p-4 backdrop-blur">
//           <h2 className="text-base font-semibold text-slate-900">Recent Uploads</h2>
//           <p className="text-sm text-slate-600">Latest reels performance</p>
//           <div className="mt-3 space-y-3">
//             {recentUploads.map((u) => (
//               <div
//                 key={u.id}
//                 className="flex items-center justify-between gap-3 rounded-xl border border-white/60 bg-white/60 p-3 backdrop-blur"
//               >
//                 <div className="flex min-w-0 items-center gap-3">
//                   <img
//                     src="/social-media-thumbnail.png"
//                     alt={`Thumbnail for ${u.title}`}
//                     className="h-12 w-12 rounded-lg object-cover"
//                   />
//                   <div className="min-w-0">
//                     <div className="truncate text-sm font-medium text-slate-900">{u.title}</div>
//                     <div className="text-xs text-slate-600">{new Date(u.date).toLocaleDateString()}</div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4 text-xs tabular-nums text-slate-700">
//                   <span className="flex items-center gap-1">
//                     <Eye className="h-3.5 w-3.5 text-indigo-600" />
//                     {u.views.toLocaleString()}
//                   </span>
//                   <span className="hidden items-center gap-1 sm:flex">
//                     <Heart className="h-3.5 w-3.5 text-pink-600" />
//                     {u.likes.toLocaleString()}
//                   </span>
//                   <span className="hidden items-center gap-1 md:flex">
//                     <MessageSquare className="h-3.5 w-3.5 text-fuchsia-600" />
//                     {u.comments.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }