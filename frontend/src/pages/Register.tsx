import React, { useState } from 'react';
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  User, 
  Mail, 
  Lock, 
  ArrowRight,
  
} from 'lucide-react';


export const Register: React.FC = () => {
 const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  agreedToTerms: false,
});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const name = `${formData.firstName} ${formData.lastName}`.trim();

    const response = await api.post("/auth/register", {
      name,
      email: formData.email,
      password: formData.password,
    });

    console.log("Registration successful:", response.data);

    alert("Account created successfully!");

    navigate("/login");
  } catch (error: any) {
    console.error("Registration failed:", error);

    const message =
      error.response?.data?.message ||
      "Registration failed. Please try again.";

    alert(message);
  }
};
  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-800">
      {/* Left Panel - Hero / Features */}
      <div className="relative hidden w-1/2 flex-col justify-between p-12 lg:flex">
        {/* Background Image with Dark Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop')` 
          }}
        >
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[2px]" />
        </div>

        {/* Header / Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-blue-400">Nextora</span>
        </div>

        {/* Content Section */}
        <div className="relative z-10 my-auto max-w-xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
              Unlock Your Academic Potential.
            </h1>
            <p className="text-lg text-slate-300">
              Join over 50,000 university students leveraging personalized guidance, 
              exclusive scholarship matching, and curated exam prep resources.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-6 pt-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-500 text-slate-300">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Tailored Scholarship Matching</h3>
                <p className="text-sm text-slate-400">
                  Get matched with funding opportunities based on your major and achievements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-500 text-slate-300">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Verified Academic Resources</h3>
                <p className="text-sm text-slate-400">
                  Access peer-reviewed study guides and previous exam patterns from top institutions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-500 text-slate-300">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Global Student Network</h3>
                <p className="text-sm text-slate-400">
                  Connect with mentors and peers from universities across the globe.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="relative z-10 text-xs tracking-wider text-slate-400 uppercase">
          Trusted by 100+ Top Tier Universities
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex flex-1 flex-col justify-between px-6 py-12 lg:px-20">
        <div className="mx-auto my-auto w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create your account</h2>
            <p className="mt-2 text-sm text-slate-500">
              Start your journey towards academic excellence today.
            </p>
          </div>

          {/* Social Sign-in Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google
            </button>
            
            {/* GitHub Button */}
<button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
  <svg className="h-4 w-4 fill-current text-slate-800" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
  GitHub
</button>

{/* Meta / Facebook Button */}
<button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
  <svg className="h-4 w-4 fill-current text-blue-600" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
  Meta
</button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400">Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Jane"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* University Email */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                University Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="j.doe@university.edu"
                  required
                />
              </div>
              <p className="mt-1 text-[10px] tracking-wide text-slate-400 uppercase">
                Prefer using your institutional email for scholarship verification.
              </p>
            </div>

            {/* Create Password */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="text-xs text-slate-500 leading-normal">
                By creating an account, you agree to our{' '}
                <a href="#" className="font-semibold text-blue-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-semibold text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Already have an account */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link
  to="/login"
  className="font-semibold text-blue-600 hover:underline"
>
  Log in
</Link>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-xs text-slate-400">
          <a href="#" className="hover:text-slate-600">Help Center</a>
          <a href="#" className="hover:text-slate-600">About Us</a>
          <a href="#" className="hover:text-slate-600">Privacy</a>
        </div>
      </div>
    </div>
  );
};

export default Register;