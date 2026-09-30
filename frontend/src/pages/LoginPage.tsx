import React, { useState } from 'react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { username, password });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#1e3a2b] p-4 font-sans overflow-hidden select-none">
      {/* Background Soft Circles */}
      <div className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[30%] h-[600px] w-[600px] rounded-full bg-black/20 blur-3xl pointer-events-none" />

      {/* Main Card Container */}
      <div className="relative z-10 flex h-[620px] w-full max-w-[960px] overflow-hidden rounded-3xl bg-[#234232] shadow-2xl">
        
        {/* Left Section: White Organic Background & Illustration */}
        <div className="relative flex w-1/2 flex-col justify-between bg-white p-8">
          
          {/* Organic Curved Mask to overlap right section */}
          <div 
            className="absolute top-0 right-[-1px] bottom-0 w-32 bg-white" 
            style={{
              clipPath: 'path("M 0 0 C 60 150, 120 250, 60 420 C 30 500, 0 580, 0 620 L 0 620 L 0 0 Z")'
            }}
          />

          {/* Header Branding */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#234232] text-white font-bold text-xl shadow-md">
              N
            </div>
            <div>
              <h1 className="text-xl font-black tracking-widest text-[#234232]">NEXTORA</h1>
              <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Innovate & Connect</p>
            </div>
          </div>

          {/* Decorative Floating Circles in Left Area */}
          <div className="absolute top-28 left-20 h-16 w-16 rounded-full bg-emerald-500/10 blur-sm" />
          <div className="absolute bottom-28 right-16 h-12 w-12 rounded-full bg-emerald-500/10 blur-xs" />

          {/* Central Vector Illustration (SVG Tree & Figures) */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center">
            <svg className="h-64 w-64" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background Blob */}
              <path d="M40 100 C 30 40, 100 20, 160 50 C 180 110, 150 170, 90 170 C 40 170, 50 140, 40 100 Z" fill="#E8F3EE" />
              
              {/* Tree Base / Trunk */}
              <rect x="94" y="140" width="12" height="25" rx="3" fill="#2d4a3e" />
              
              {/* Layered Pine Tree */}
              <polygon points="100,30 145,90 55,90" fill="#2d5a44" />
              <polygon points="100,60 155,125 45,125" fill="#234a37" />
              <polygon points="100,90 165,155 35,155" fill="#1b3b2b" />
              
              {/* Star */}
              <polygon points="100,20 103,27 110,27 104,31 106,38 100,33 94,38 96,31 90,27 97,27" fill="#FBBF24" />
              
              {/* Ornaments */}
              <circle cx="85" cy="75" r="4" fill="#E11D48" />
              <circle cx="115" cy="85" r="4" fill="#FBBF24" />
              <circle cx="70" cy="110" r="4.5" fill="#E11D48" />
              <circle cx="130" cy="115" r="4.5" fill="#E11D48" />
              <circle cx="100" cy="135" r="4" fill="#FBBF24" />
              <circle cx="80" cy="140" r="4" fill="#E11D48" />
              <circle cx="120" cy="142" r="4" fill="#E11D48" />

              {/* Snow / Ground Detail */}
              <ellipse cx="100" cy="165" rx="55" ry="8" fill="#D1E4DB" />

              {/* Small Figures */}
              <circle cx="65" cy="155" r="4" fill="#1b3b2b" />
              <path d="M61 165 L65 159 L69 165" stroke="#1b3b2b" strokeWidth="2" />
              
              <circle cx="140" cy="152" r="4" fill="#1b3b2b" />
              <path d="M136 162 L140 156 L144 162" stroke="#1b3b2b" strokeWidth="2" />
            </svg>
          </div>

          {/* Footer Text */}
          <div className="relative z-10 text-[11px] leading-tight text-gray-400">
            <p>© 2026 NEXTORA Inc.</p>
            <p className="text-gray-400/80">Powered by Nextora Auth Engine</p>
          </div>
        </div>

        {/* Right Section: Form Container */}
        <div className="flex w-1/2 flex-col justify-between p-12 pl-16 text-white">
          <div className="my-auto w-full max-w-sm">
            
            {/* Title */}
            <div className="mb-8 flex items-baseline gap-1">
              <h2 className="text-4xl font-semibold tracking-tight">Login</h2>
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full rounded-full bg-[#182e23] px-5 py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-emerald-500/50"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-full bg-[#182e23] px-5 py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-emerald-500/50"
                  required
                />
              </div>

              <div className="text-right">
                <a href="#forgot" className="text-xs text-emerald-400 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#4ba398] py-2.5 text-sm font-medium text-white transition hover:bg-[#3d8b81] active:scale-[0.99]"
              >
                Login
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center text-xs text-gray-300">
              Don't have an account?{' '}
              <a href="#register" className="font-semibold text-emerald-400 hover:underline">
                Register Now
              </a>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="flex flex-col items-center justify-between gap-1 text-[11px] text-gray-400">
            <a href="#terms" className="hover:underline">
              Terms and Services
            </a>
            <p className="mt-4 text-[10px] text-gray-400">
              Have a problem? Contact us at{' '}
              <a href="mailto:support@nextora.io" className="text-emerald-400 underline">
                support@nextora.io
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
export default LoginPage;


// import React, { useState } from 'react';
// import { ArrowLeft, Eye, EyeOff, Maximize2, Sparkles } from 'lucide-react';

// export const LoginPage: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Logging in with:', { email, password });
//   };

//   const handleBack = () => {
//     if (window.history.length > 1) {
//       window.history.back();
//     } else {
//       console.log('Navigate to home');
//     }
//   };

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen().catch(() => {});
//       setIsExpanded(true);
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen().catch(() => {});
//         setIsExpanded(false);
//       }
//     }
//   };

//   return (
//     <main className="relative flex min-h-screen w-full items-center justify-center bg-[#214D3F] p-3 sm:p-6 font-sans overflow-hidden select-none">
      
//       {/* 1. Background Ambient Shapes */}
//       <div className="absolute top-[-10%] left-[-10%] h-[550px] w-[550px] rounded-full bg-[#285B4B]/60 blur-3xl pointer-events-none" />
//       <div className="absolute bottom-[-15%] right-[-5%] h-[600px] w-[600px] rounded-full bg-[#193F34]/80 blur-3xl pointer-events-none" />
//       <div className="absolute top-[20%] right-[15%] h-[350px] w-[350px] rounded-full bg-[#376C5B]/30 blur-2xl pointer-events-none" />
      
//       {/* Floating Subtle Circles in Ambient Space */}
//       <div className="absolute top-[12%] left-[18%] h-32 w-32 rounded-full bg-white/5 blur-sm pointer-events-none" />
//       <div className="absolute bottom-[20%] left-[8%] h-48 w-48 rounded-full bg-white/5 blur-md pointer-events-none" />
//       <div className="absolute top-[40%] right-[8%] h-24 w-24 rounded-full bg-white/5 blur-xs pointer-events-none" />

//       {/* 2. Top-Left Back Button */}
//       <button
//         onClick={handleBack}
//         aria-label="Go back"
//         className="fixed top-5 left-5 z-50 flex h-[64px] w-[64px] sm:h-[70px] sm:w-[70px] items-center justify-center rounded-[22px] bg-white text-[#111111] shadow-lg transition-all duration-200 hover:-translate-x-0.5 hover:shadow-xl active:translate-x-0 focus:outline-none focus:ring-2 focus:ring-white/50"
//       >
//         <ArrowLeft className="h-8 w-8" />
//       </button>

//       {/* 3. Main Login Card Panel */}
//       <div className="relative z-10 flex h-[94vh] min-h-[600px] max-h-[820px] w-[95vw] max-w-[1240px] flex-col overflow-hidden rounded-[22px] bg-[#193F34] shadow-2xl border border-white/10 lg:flex-row">
        
//         {/* LEFT SECTION: Asymmetric Organic White Shape */}
//         <div className="relative flex min-h-[300px] w-full flex-col justify-between bg-white p-6 sm:p-10 lg:w-[54%]">
          
//           {/* Organic SVG Curve Boundary (Visible on Desktop) */}
//           <div className="absolute top-0 bottom-0 right-[-1px] hidden w-32 pointer-events-none lg:block">
//             <svg
//               className="h-full w-full fill-white"
//               viewBox="0 0 100 800"
//               preserveAspectRatio="none"
//               aria-hidden="true"
//             >
//               <path d="M 0,0 L 40,0 C 95,160 100,280 65,420 C 30,560 85,700 0,800 Z" />
//             </svg>
//           </div>

//           {/* Nextora Brand Header */}
//           <header className="relative z-10 flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#214D3F] text-white shadow-md">
//               <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
//                 <polyline points="10 2 10 10 13 7 16 10 16 2" />
//               </svg>
//             </div>
//             <div>
//               <span className="text-2xl font-bold tracking-wider text-[#193F34]">NEXTORA</span>
//               <p className="text-[11px] font-medium tracking-wide text-gray-500 uppercase">Know what's next.</p>
//             </div>
//           </header>

//           {/* Decorative Translucent Floating Circles inside White Area */}
//           <div className="absolute top-1/4 left-12 h-16 w-16 rounded-full bg-emerald-500/5 blur-xs pointer-events-none" />
//           <div className="absolute bottom-1/3 right-16 h-24 w-24 rounded-full bg-emerald-500/10 blur-sm pointer-events-none" />

//           {/* Educational / Career Vector Illustration */}
//           <div className="relative z-10 my-auto flex items-center justify-center py-4">
//             <svg className="h-auto w-full max-w-[320px] sm:max-w-[380px]" viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg">
//               {/* Organic Soft Background Blob */}
//               <path d="M60 160 C 40 80, 150 30, 260 60 C 350 90, 370 200, 290 270 C 190 320, 80 240, 60 160 Z" fill="#EBF3F0" />
              
//               {/* Decorative Tree / Growth Symbol */}
//               <path d="M200 80 L230 140 L210 140 L240 200 L160 200 L190 140 L170 140 Z" fill="#285B4B" opacity="0.85" />
//               <rect x="194" y="200" width="12" height="35" rx="2" fill="#193F34" />
              
//               {/* Graduation Cap / Achievement Symbol */}
//               <path d="M300 110 L340 125 L300 140 L260 125 Z" fill="#376C5B" />
//               <rect x="288" y="129" width="24" height="12" rx="2" fill="#214D3F" />
//               <path d="M330 130 L330 155" stroke="#E96B6B" strokeWidth="2" strokeLinecap="round" />
//               <circle cx="330" cy="157" r="3" fill="#E96B6B" />

//               {/* Student Figure with Laptop/Planner */}
//               <circle cx="120" cy="180" r="14" fill="#214D3F" />
//               <path d="M100 230 C 100 200, 140 200, 140 230 Z" fill="#285B4B" />
//               <rect x="125" y="205" width="28" height="18" rx="3" fill="#66B5BA" transform="rotate(-10 125 205)" />

//               {/* Stars & Goals Elements */}
//               <path d="M130 90 L133 98 L141 98 L134 103 L137 111 L130 106 L123 111 L126 103 L119 98 L127 98 Z" fill="#F4BF42" />
//               <path d="M280 70 L282 75 L287 75 L283 78 L285 83 L280 80 L275 83 L277 78 L273 75 L278 75 Z" fill="#F4BF42" />
//               <circle cx="210" cy="60" r="4" fill="#E96B6B" />
//               <circle cx="90" cy="130" r="6" fill="#66B5BA" opacity="0.6" />
//             </svg>
//           </div>

//           {/* Footer Copyright */}
//           <footer className="relative z-10 text-[11px] text-gray-400">
//             <p>© 2026 Nextora Inc. All rights reserved.</p>
//             <p className="text-gray-400/80">Powered by Nextora Education Platform</p>
//           </footer>
//         </div>

//         {/* RIGHT SECTION: Dark Green Login Form Container */}
//         <div className="flex w-full flex-col justify-between p-6 sm:p-12 lg:w-[46%] lg:pl-16 text-[#F5F7F5]">
//           <div className="my-auto w-full max-w-[360px] mx-auto lg:mx-0">
            
//             {/* Login Heading with Red Accent Dot */}
//             <div className="mb-8 flex items-baseline gap-1.5">
//               <h1 className="text-[32px] font-semibold tracking-tight text-[#F5F7F5]">Login</h1>
//               <span className="h-2 w-2 rounded-full bg-[#E96B6B]" aria-hidden="true" />
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Email Input */}
//               <div className="space-y-1.5">
//                 <label htmlFor="email" className="block text-[13px] font-medium text-gray-300">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   required
//                   className="h-[44px] w-full rounded-[22px] bg-black/25 px-5 text-[14px] text-white placeholder-emerald-100/40 border border-transparent outline-none transition focus:border-[#66B5BA]/50 focus:ring-2 focus:ring-[#66B5BA]/30"
//                 />
//               </div>

//               {/* Password Input with Visibility Toggle */}
//               <div className="space-y-1.5">
//                 <label htmlFor="password" className="block text-[13px] font-medium text-gray-300">
//                   Password
//                 </label>
//                 <div className="relative flex items-center">
//                   <input
//                     id="password"
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                     required
//                     className="h-[44px] w-full rounded-[22px] bg-black/25 pl-5 pr-12 text-[14px] text-white placeholder-emerald-100/40 border border-transparent outline-none transition focus:border-[#66B5BA]/50 focus:ring-2 focus:ring-[#66B5BA]/30"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     aria-label={showPassword ? 'Hide password' : 'Show password'}
//                     className="absolute right-4 text-gray-400 transition hover:text-white focus:outline-none"
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//               </div>

//               {/* Forgot Password Link */}
//               <div className="text-right">
//                 <a
//                   href="#forgot-password"
//                   className="text-[12px] text-emerald-200/70 transition hover:text-white hover:underline"
//                 >
//                   Forgot password?
//                 </a>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="h-[44px] w-full rounded-[24px] bg-[#66B5BA] text-[14px] font-medium text-white shadow-md transition-all duration-150 hover:bg-[#5aa4a9] hover:-translate-y-[1px] active:translate-y-0 active:shadow-none focus:outline-none focus:ring-2 focus:ring-white/40"
//               >
//                 Login
//               </button>
//             </form>

//             {/* Registration Navigation */}
//             <div className="mt-6 text-center text-[13px] text-gray-300">
//               <span>Don't have an account? </span>
//               <a
//                 href="/register"
//                 className="font-semibold text-white underline transition hover:text-emerald-200"
//               >
//                 Register Now
//               </a>
//             </div>
//           </div>

//           {/* Footer Terms & Policy */}
//           <div className="mt-8 flex flex-col items-center justify-between gap-2 text-[11px] text-emerald-200/50 lg:flex-row">
//             <div className="flex gap-4">
//               <a href="#terms" className="hover:underline hover:text-emerald-200">Terms & Services</a>
//               <a href="#privacy" className="hover:underline hover:text-emerald-200">Privacy Policy</a>
//             </div>
//             <p className="text-[10px]">
//               Have a problem? Contact{' '}
//               <a href="mailto:support@nextora.com" className="underline text-emerald-200">
//                 support@nextora.com
//               </a>
//             </p>
//           </div>

//         </div>
//       </div>

//       {/* 4. Bottom-Right Utility Floating Controls */}
//       <aside className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
//         {/* Fullscreen Toggle Button */}
//         <button
//           onClick={toggleFullscreen}
//           aria-label="Expand view"
//           className="group relative flex h-[68px] w-[68px] sm:h-[72px] sm:w-[72px] items-center justify-center rounded-full bg-white/25 text-[#111111] backdrop-blur-md transition hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
//         >
//           <Maximize2 className="h-6 w-6 text-[#111111]" />
//         </button>

//         {/* AI Assistant Button */}
//         <div className="group relative">
//           <button
//             aria-label="Ask Nextora AI"
//             className="flex h-[68px] w-[68px] sm:h-[72px] sm:w-[72px] items-center justify-center rounded-full bg-white/25 text-[#111111] backdrop-blur-md transition hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
//           >
//             <Sparkles className="h-6 w-6 text-[#111111]" />
//           </button>
          
//           {/* Tooltip on Hover */}
//           <div className="absolute right-full top-1/2 mr-3 -translate-y-1/2 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto">
//             <div className="whitespace-nowrap rounded-lg bg-black/80 px-3 py-1.5 text-xs text-white backdrop-blur-sm shadow-md">
//               ✨ Ask Nextora AI
//             </div>
//           </div>
//         </div>
//       </aside>

//     </main>
//   );
// };
// export default LoginPage;


