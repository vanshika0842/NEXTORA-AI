import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  ShieldCheck 
} from 'lucide-react';



export const Login: React.FC = () => {
const { login } = useAuth();
const navigate = useNavigate();
 const [formData, setFormData] = useState({
  emailOrStudentId: "",
  password: "",
  rememberMe: true,
});

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await login(
      formData.emailOrStudentId,
      formData.password
    );

    navigate("/dashboard",{replace:true});
  } catch (error: any) {
    console.error("Login failed:", error);

    const message =
      error.response?.data?.message ||
      "Invalid email or password.";

    alert(message);
  }
};



  return (
    <div className="flex min-h-screen w-full bg-slate-50/50 font-sans text-slate-800">
      {/* Left Panel - Hero Branding & Features */}
      <div className="relative hidden w-1/2 flex-col justify-between border-r border-slate-200/60 bg-white p-12 lg:flex">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-blue-500">Nextora</span>
        </div>

        {/* Center Content */}
        <div className="mx-auto my-auto max-w-md w-full space-y-6">
          {/* Hero Image Card */}
          <div className="overflow-hidden rounded-2xl bg-slate-100 shadow-sm border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
              alt="Student working on laptop"
              className="h-64 w-full object-cover object-top"
            />
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-500 sm:text-4xl">
              Empowering Your
            </h1>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-400 sm:text-4xl">
              Academic Journey.
            </h1>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            Access curated scholarship matches, professional exam prep, and personalized guidance designed for your university success.
          </p>

          {/* Feature Badge Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 shadow-2xs">
              <CheckCircle2 className="h-5 w-5 text-slate-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-600">50,000+ Students Guided</span>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 shadow-2xs">
              <Globe className="h-5 w-5 text-slate-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-600">Global Scholarship Network</span>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 shadow-2xs">
              <ShieldCheck className="h-5 w-5 text-slate-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-600">Verified Institutional Resources</span>
            </div>
          </div>
        </div>

        {/* Spacer for vertical layout balance */}
        <div className="h-4" />
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="flex flex-1 flex-col justify-between bg-slate-50/30 px-6 py-12 lg:px-20">
        <div className="mx-auto my-auto w-full max-w-md">
          {/* Header with Decorative Graduation Cap */}
          <div className="relative mb-8 flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue your path to excellence.
              </p>
            </div>
            <div className="text-blue-100">
              <GraduationCap className="h-16 w-16 stroke-[1.25]" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email or Student ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email or Student ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="emailOrStudentId"
                  value={formData.emailOrStudentId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="student@university.edu"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-blue-500 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-10 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Keep me signed in */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="text-xs font-medium text-slate-600 cursor-pointer">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In to Portal
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] tracking-wider uppercase">
              <span className="bg-slate-50/30 px-3 text-slate-400 font-medium">New to ScholarPath?</span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-xs text-slate-500">
            Start your academic journey today.{' '}
            <Link
         to="/register"
         className="font-bold text-blue-500 hover:underline"
>
  Create Account
</Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 space-y-4 text-center">
          <div className="flex justify-center gap-6 text-xs font-medium text-slate-500">
            <a href="#" className="hover:text-slate-800">Technical Support</a>
            <a href="#" className="hover:text-slate-800">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800">Accessibility</a>
          </div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            © 2026 SCHOLARPATH PRO • HIGHER ED EXCELLENCE
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;