import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Users,
  Wrench,
  Shield,
  GraduationCap,
  Clock,
  Camera,
  MapPin,
  TrendingUp,
  Award,
  Layers,
  Flame,
  ThumbsUp,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_CONFIG, CategoryIcon } from '../components/common/CategoryIcons';

export const LandingPage = () => {
  const { user, isAuthenticated, isAdmin, isWorker } = useAuth();

  const categoriesList = Object.entries(CATEGORY_CONFIG);

  return (
    <div className="space-y-20 pb-16 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient background glow accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-indigo-500/20 via-sky-500/15 to-cyan-500/10 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/30 backdrop-blur-md shadow-sm">
              <img src="/campusfixWithoutNamelogo.png" alt="CampusFix Emblem" className="w-5 h-5 object-contain shrink-0 drop-shadow-sm" />
              <span>Smart Campus Infrastructure & Maintenance OS</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1]">
              Fixing Campus Problems,{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-sky-400 dark:to-cyan-300 bg-clip-text text-transparent">
                Faster & Transparently.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              CampusFix unites students, maintenance technicians, and estate administrators in a single verified platform.
              Report broken facilities in 30 seconds, crowd-prioritize urgent fixes with <strong className="text-indigo-600 dark:text-cyan-400 font-bold">+1 upvotes</strong>, and track every repair with verified photo proof.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                to="/feed"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:opacity-95 shadow-glowBrand hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Browse Live Feed</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/report"
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-100 glass-card hover:border-indigo-500/50 hover:bg-slate-200/40 dark:hover:bg-slate-800/60 transition-all shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-indigo-500" />
                <span>Report Issue</span>
              </Link>

              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <span>Select Role & Sign In</span>
                </Link>
              )}
            </div>

            {/* Logged in Quick Banner */}
            {isAuthenticated && (
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-between gap-3 text-xs text-indigo-900 dark:text-cyan-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  Logged in as <strong>{user?.name}</strong> ({user?.role})
                </span>
                <Link
                  to={isAdmin ? '/admin' : isWorker ? '/worker' : '/feed'}
                  className="font-bold underline hover:text-indigo-600 dark:hover:text-cyan-200"
                >
                  Go to {isAdmin ? 'Admin Center' : isWorker ? 'Technician Portal' : 'My Dashboard'} &rarr;
                </Link>
              </div>
            )}

            {/* Value Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-3 text-left">
              <div className="p-3 rounded-2xl glass-card border border-slate-200/70 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400 font-bold text-xs">
                  <Zap className="w-3.5 h-3.5" /> Instant
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">30s photo reports</p>
              </div>

              <div className="p-3 rounded-2xl glass-card border border-slate-200/70 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Before/after photos</p>
              </div>

              <div className="p-3 rounded-2xl glass-card border border-slate-200/70 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 text-cyan-500 font-bold text-xs">
                  <ThumbsUp className="w-3.5 h-3.5" /> +1 Upvotes
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Crowd-prioritized</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dynamic Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-6 sm:p-7 glass-panel border border-slate-200/70 dark:border-slate-800/80 shadow-2xl space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 shrink-0">
                    <img src="/campusfixWithoutNamelogo.png" alt="CampusFix" className="w-full h-full object-contain drop-shadow-sm" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Live Campus Ticket Lifecycle
                  </span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/30">
                  Priority: High (45)
                </span>
              </div>

              {/* Sample Ticket Visual */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      Water Leakage Near Lab 204
                    </span>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-cyan-400">👍 38 +1s</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Hostel Block A • 2nd Floor • Main Restroom Pipe Joint
                  </p>
                </div>

                {/* Transition flow simulation */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span><strong>Reported</strong> by Aryan Sharma (CS Student)</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <Wrench className="w-4 h-4 shrink-0" />
                    <span><strong>Dispatched</strong> to Ramesh Kumar (Plumbing Tech)</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    <Camera className="w-4 h-4 shrink-0" />
                    <span><strong>Resolution Proof</strong> uploaded with repair photos</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Award className="w-4 h-4 shrink-0" />
                    <span><strong>Verified & Closed</strong> by original reporter (5/5 ⭐)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  to="/feed"
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
                >
                  View live campus complaints queue &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "WHAT IS CAMPUSFIX FOR?" (3 SPECIALIZED PILLARS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
            <Layers className="w-3.5 h-3.5" />
            <span>Built For The Whole Campus Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
            What is CampusFix for?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Traditional complaints get lost in phone calls and paper logs. CampusFix transforms facilities management into a modern, transparent campus operations network.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Students & Residents */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/70 dark:border-slate-800/80 shadow-glass flex flex-col justify-between hover:border-emerald-500/40 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                For Students & Campus Residents
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Spot a broken tap, burnt light, or faulty air conditioner? Report it with a photo in under 30 seconds.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>+1 Upvote</strong> common problems without duplicate tickets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Live status notifications as workers are dispatched</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Verify repairs</strong> before tickets are officially closed</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-200/50 dark:border-slate-800/60">
              <Link
                to="/login?role=student"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:underline"
              >
                Access Student Portal &rarr;
              </Link>
            </div>
          </div>

          {/* Pillar 2: Maintenance Technicians */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/70 dark:border-slate-800/80 shadow-glass flex flex-col justify-between hover:border-cyan-500/40 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                For Maintenance Technicians
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Eliminate paper work-orders. Technicians get a dedicated real-time queue with clear priorities and locations.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Exact block, floor & room location with reporter details</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>1-click task lifecycle: Acknowledge & Start On-Site</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span><strong>Upload Before/After photos</strong> as irrefutable proof</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-200/50 dark:border-slate-800/60">
              <Link
                to="/login?role=worker"
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 group-hover:underline"
              >
                Access Technician Portal &rarr;
              </Link>
            </div>
          </div>

          {/* Pillar 3: Campus Administrators */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/70 dark:border-slate-800/80 shadow-glass flex flex-col justify-between hover:border-indigo-500/40 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                For Campus Estate & Administration
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Full command & control. Supervise work queues, dispatch certified technicians, and analyze campus infrastructure health.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span><strong>Smart Priority Engine</strong> combines votes + hazard weight</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Workload-balanced dispatching across maintenance staff</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Full turnaround SLA metrics & category breakdown</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-200/50 dark:border-slate-800/60">
              <Link
                to="/login?role=admin"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:underline"
              >
                Access Admin Command Center &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3-STEP INTERACTIVE LIFECYCLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
            How CampusFix Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A seamless, transparent loop from the moment an issue is spotted to the moment it is verified fixed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/70 dark:border-slate-800/80 relative space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-glowBrand">
              1
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Spot & Report in 30 Seconds
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Snap a quick photo, select your campus building & floor, and specify the problem. The system immediately publishes the ticket to the campus feed.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>Geotagged with Building, Floor & Room</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/70 dark:border-slate-800/80 relative space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-white font-black flex items-center justify-center text-lg shadow-glowCyan">
              2
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Community +1 Upvotes & Dispatch
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Peers upvote issues affecting them. The smart algorithm boosts critical hazards to the top of the Admin dashboard for instant technician dispatch.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-cyan-500" />
              <span>Smart Priority Score = Upvotes + Severity</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/70 dark:border-slate-800/80 relative space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white font-black flex items-center justify-center text-lg shadow-glowEmerald">
              3
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Repair, Proof & Verification
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Technician completes the fix on-site and uploads before/after photos with repair notes. The original reporter verifies and rates the fix before closing.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Satisfaction Guaranteed & Star Rated</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CAMPUS FACILITIES CATEGORY VECTOR GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>Comprehensive Campus Coverage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Maintenance Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Browse issues across all campus facility disciplines.
            </p>
          </div>

          <Link
            to="/feed"
            className="text-xs font-bold text-indigo-600 dark:text-cyan-400 flex items-center gap-1 hover:underline"
          >
            Explore all complaints in Feed &rarr;
          </Link>
        </div>

        {/* Category Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {categoriesList.map(([key, config]) => (
            <Link
              key={key}
              to={`/feed?category=${encodeURIComponent(key)}`}
              className="p-4 rounded-2xl glass-card border border-slate-200/70 dark:border-slate-800/80 flex items-center gap-3.5 hover:border-indigo-500/50 group transition-all"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center p-2.5 text-white bg-gradient-to-br ${config.gradient} shadow-sm group-hover:scale-110 transition-transform`}
              >
                {config.svg}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                  {config.label}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {config.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. DIRECT ROLE ENTRY PORTALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Choose Your Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select your role to access your dedicated workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/login?role=student"
            className="p-6 rounded-3xl glass-panel border border-emerald-500/30 hover:border-emerald-500 hover:shadow-glowEmerald transition-all text-center group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Campus Resident / Student
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Report issues, upvote fixes & verify repairs
            </p>
            <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
              Enter Resident Portal &rarr;
            </span>
          </Link>

          <Link
            to="/login?role=worker"
            className="p-6 rounded-3xl glass-panel border border-cyan-500/30 hover:border-cyan-500 hover:shadow-glowCyan transition-all text-center group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-500 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Maintenance Technician
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage work orders, on-site tasks & upload proof
            </p>
            <span className="inline-block text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:underline">
              Enter Technician Portal &rarr;
            </span>
          </Link>

          <Link
            to="/login?role=admin"
            className="p-6 rounded-3xl glass-panel border border-indigo-500/30 hover:border-indigo-500 hover:shadow-glowBrand transition-all text-center group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-500 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Campus Administrator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Command center, priority calibration & dispatch
            </p>
            <span className="inline-block text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">
              Enter Admin Center &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-10 glass-panel border border-indigo-500/30 shadow-2xl relative overflow-hidden text-center space-y-5">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto drop-shadow-2xl">
            <img src="/campusfixWithoutNamelogo.png" alt="CampusFix" className="w-full h-full object-contain" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
            Ready to elevate your campus operations?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Whether you are reporting a facility issue or dispatching 100+ daily maintenance orders, CampusFix makes university infrastructure smooth, accountable, and responsive.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/feed"
              className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:opacity-95 shadow-glowBrand hover:scale-105 transition-all"
            >
              Explore Live Feed
            </Link>
            <Link
              to="/report"
              className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold glass-card text-slate-800 dark:text-slate-100 hover:border-indigo-500 transition-all"
            >
              Report a Problem
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
