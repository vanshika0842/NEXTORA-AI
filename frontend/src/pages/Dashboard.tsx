import React,{ useEffect, useState }  from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Award,
  Settings,
  LogOut,
  Search,
  Bell,
  Filter,
  Sparkles,
  BookOpen,
  Clock,
  ExternalLink,
  ChevronRight,
  Star,
  Calendar,
  Ribbon,
  BriefcaseBusiness,
} from 'lucide-react';

// --- TS Interfaces ---
interface StatCardProps {
  icon: React.ReactNode;
  badgeText: string;
  badgeType?: 'badge' | 'progress';
  title: string;
  value: string;
}

interface CourseProps {
  tag: string;
  provider: string;
  title: string;
  duration: string;
  rating: string;
  image: string;
}

interface ExamProps {
  image: string;
  tag: string;
  title: string;
  date: string;
  price: string;
}

interface StudentProfile {
  id: number;
  userId: number;

  educationLevel: string | null;

  institutionName: string | null;
  institutionType: string | null;
  state: string | null;
  city: string | null;

  // School
  schoolClass: string | null;
  schoolBoard: string | null;
  schoolStream: string | null;
  schoolSubjects: string[] | null;
  expectedCompletionYear: number | null;

  // College
  degreeLevel: string | null;
  degree: string | null;
  branch: string | null;
  currentYear: number | null;
  currentSemester: number | null;
  expectedGraduationYear: number | null;

  // Academic
  academicScore: string | null;
  academicScoreType: string | null;
  gpa: string | null;
  backlogs: number | null;

  // Identification
  studentId: string | null;

  // Graduate
  highestQualification: string | null;
  graduationYear: number | null;
  employmentStatus: string | null;
  workExperience: string | null;

  // Career
  academicInterests: string | null;
  careerGoals: string | null;

  createdAt: string;
  updatedAt: string;
}

interface ProfileResponse {
  profile: StudentProfile | null;
}


// --- Main Component ---
export default function Dashboard() {
  const { user,logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      setProfileError(null);

      const response = await api.get<ProfileResponse>("/profile");

      const profileData = response.data.profile;

      if (!profileData) {
        setProfile(null);
        return;
      }

      setProfile({
        ...profileData,
        schoolSubjects: Array.isArray(profileData.schoolSubjects)
          ? profileData.schoolSubjects
          : null,
      });
    } catch (error) {
      console.error("Failed to fetch student profile:", error);

      setProfile(null);
      setProfileError("Unable to load your academic profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  if (!user) {
    setProfile(null);
    setProfileLoading(false);
    return;
  }

  fetchProfile();
}, [user]);


const getProfileCompletion = (
  profile: StudentProfile | null
): number => {
  if (!profile) {
    return 0;
  }

  const commonFields = [
    profile.educationLevel,
    profile.institutionName,
    profile.institutionType,
    profile.state,
    profile.city,
  ];

  let relevantFields: unknown[] = [...commonFields];

  if (profile.educationLevel === "school") {
    relevantFields = [
      ...relevantFields,
      profile.schoolClass,
      profile.schoolBoard,
      profile.schoolStream,
      profile.schoolSubjects,
      profile.academicScore,
      profile.academicScoreType,
      profile.expectedCompletionYear,
      profile.academicInterests,
      profile.careerGoals,
    ];
  }

  if (profile.educationLevel === "college") {
    relevantFields = [
      ...relevantFields,
      profile.degreeLevel,
      profile.degree,
      profile.branch,
      profile.currentYear,
      profile.currentSemester,
      profile.expectedGraduationYear,
      profile.academicScore,
      profile.academicScoreType,
      profile.backlogs,
      profile.studentId,
      profile.academicInterests,
      profile.careerGoals,
    ];
  }

  if (profile.educationLevel === "graduate") {
    relevantFields = [
      ...relevantFields,
      profile.highestQualification,
      profile.degree,
      profile.branch,
      profile.graduationYear,
      profile.academicScore,
      profile.academicScoreType,
      profile.studentId,
      profile.employmentStatus,
      profile.workExperience,
      profile.academicInterests,
      profile.careerGoals,
    ];
  }

  const completedFields = relevantFields.filter((field) => {
    if (Array.isArray(field)) {
      return field.length > 0;
    }

    return (
      field !== null &&
      field !== undefined &&
      field !== ""
    );
  }).length;

  if (relevantFields.length === 0) {
    return 0;
  }

  return Math.round(
    (completedFields / relevantFields.length) * 100
  );
};

const getProfileCompletionMessage = (
  profile: StudentProfile | null
): string => {
  if (!profile) {
    return "Complete your academic profile to unlock personalized opportunities.";
  }

  const completion = getProfileCompletion(profile);

  if (completion === 100) {
    return "Your academic profile is complete. You're ready for personalized opportunities.";
  }

  if (completion >= 75) {
    return "Your profile is almost complete. Add the remaining details for better recommendations.";
  }

  if (completion >= 50) {
    return "You're halfway there. Complete more details to improve opportunity matching.";
  }

  return "Complete your academic profile to improve your opportunity matches.";
};

const profileCompletion = getProfileCompletion(profile);


  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

const educationLevel = profile?.educationLevel?.toLowerCase() || "";

const isSchoolStudent = educationLevel === "school";
const isCollegeStudent = educationLevel === "college";
const isGraduate = educationLevel === "graduate";

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 py-2 mb-6">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-800">Nextora</span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-medium">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </a>
            <a href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium">
              <UserCheck className="w-5 h-5" />
              Academic Profile
            </a>
            <a href="/opportunities" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium">
              <FileText className="w-5 h-5" />
              Opportunities
            </a>
            <a href="/opportunities?type=SCHOLARSHIP" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium">
              <Award className="w-5 h-5" />
              Scholarships
            </a>
          </nav>
        </div>

        {/* Bottom Nav */}
        <div className="border-t border-slate-200 pt-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm">
            <Settings className="w-4 h-4" />
            Settings
          </a>
          <button
  type="button"
  onClick={handleLogout}
  className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-sm font-medium"
>
  <LogOut className="w-4 h-4" />
  Log out
</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between gap-4">
          <div className="flex items-center text-xs text-slate-500 gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Nextora</span>
            <span>/</span>
            <span className="text-slate-800 font-medium">Dashboard</span>
          </div>

          {/* Search & Profile */}
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search resources, exams..."
                className="w-full bg-slate-100 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop"
                alt="Student"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-xs">
        <p className="font-semibold text-slate-800">
    {user?.name || "Student"}
       </p>

     <p className="text-slate-500">
    {user?.email || "Loading..."}
      </p>

  {profileLoading && (
    <p className="text-[10px] text-slate-400">
      Loading academic profile...
    </p>
  )}

  {!profileLoading && profileError && (
    <p className="text-[10px] text-rose-500">
      {profileError}
    </p>
  )}

  {!profileLoading && !profileError && profile && (
  <p className="text-[10px] text-slate-400">
    {profile.educationLevel === "school"
      ? `Class ${profile.schoolClass || ""}`
      : profile.educationLevel === "college"
      ? `${profile.degree || "College Student"}${
          profile.branch ? ` • ${profile.branch}` : ""
        }`
      : profile.educationLevel === "graduate"
      ? `${profile.degree || profile.highestQualification || "Graduate"}${
          profile.branch ? ` • ${profile.branch}` : ""
        }`
      : "Academic Profile"}
  </p>
)}
</div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
  Student Dashboard
</h1>

          <p className="text-sm text-slate-500">
  Welcome back, {user?.name || "Student"}. Here is your academic progress today.
</p>

{!profileLoading && profile && (
  <p className="text-xs text-slate-400 mt-1">
    {profile.educationLevel === "school" &&
      `School Student • Class ${profile.schoolClass || "—"}${
        profile.schoolStream ? ` • ${profile.schoolStream}` : ""
      }`}

    {profile.educationLevel === "college" &&
      `College Student • ${profile.degree || "Degree"}${
        profile.branch ? ` • ${profile.branch}` : ""
      }`}

    {profile.educationLevel === "graduate" &&
      `Graduate • ${
        profile.degree || profile.highestQualification || "Graduate"
      }${
        profile.employmentStatus
          ? ` • ${profile.employmentStatus}`
          : ""
      }`}
  </p>
)}
            
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <Filter className="w-4 h-4" /> Filter View
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm shadow-blue-500/30">
                <Sparkles className="w-4 h-4" /> View Smart Recommendations
              </button>
            </div>
          </div>

          {/* Key Metrics Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Ribbon className="w-5 h-5 text-blue-600" />} badgeText="+3 NEW" title="SCHOLARSHIPS MATCHED" value="12" />
            <StatCard icon={<BookOpen className="w-5 h-5 text-emerald-600" />} badgeText="75% DONE" title="PREP COURSES" value="4 Active" />
            <StatCard icon={<Award className="w-5 h-5 text-amber-600" />} badgeText="EXPIRES DEC" title="EXAM CREDITS" value="50000 INR" />
            <StatCard icon={<Clock className="w-5 h-5 text-indigo-600" />} badgeText="+12% WKLY" title="STUDY HOURS" value="24.5h" />
          </div>
{/* Profile Completion */}
<div className="bg-white rounded-2xl border border-slate-200 p-5">
  <div className="flex items-start justify-between gap-4">
    <div>
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
          <UserCheck className="w-4 h-4 text-blue-600" />
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Profile Completion
          </p>

          <h3 className="text-base font-bold text-slate-800 mt-0.5">
            {profileCompletion}% Complete
          </h3>
        </div>
      </div>

      <p className="text-sm text-slate-500 mt-4 max-w-2xl">
        {getProfileCompletionMessage(profile)}
      </p>
    </div>

    <button
      type="button"
      onClick={() => navigate("/profile")}
      className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
    >
      {profileCompletion === 100 ? "View Profile" : "Complete Profile"}
      <ChevronRight className="w-3.5 h-3.5" />
    </button>
  </div>

  <div className="mt-5">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-slate-500">
        Completion progress
      </span>

      <span className="text-xs font-bold text-slate-700">
        {profileCompletion}%
      </span>
    </div>

    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
      <div
        className="h-full rounded-full bg-blue-600 transition-all duration-700"
        style={{
          width: `${profileCompletion}%`,
        }}
      />
    </div>
  </div>

  {profileCompletion < 100 && (
    <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-500" />

        <p className="text-xs font-medium text-slate-600">
          More complete profiles produce better opportunity matching.
        </p>
      </div>
    </div>
  )}
</div>


{/* Education Summary */}
<div className="bg-white rounded-2xl border border-slate-200 p-5">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        Your Education
      </p>

      <h3 className="text-lg font-bold text-slate-800 mt-1">
        {isSchoolStudent
          ? `Class ${profile?.schoolClass || "—"}`
          : isCollegeStudent
          ? profile?.degree || "College Student"
          : isGraduate
          ? profile?.degree ||
            profile?.highestQualification ||
            "Graduate"
          : "Academic Profile"}
      </h3>

      <p className="text-xs text-slate-500 mt-1">
        {profile?.institutionName || "Institution not added"}
      </p>
    </div>

    <div className="p-3 bg-blue-50 rounded-xl">
      <BookOpen className="w-5 h-5 text-blue-600" />
    </div>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

    {/* SCHOOL */}
    {isSchoolStudent && (
      <>
        <div>
          <p className="text-[10px] text-slate-400 uppercase">
            Board
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {profile?.schoolBoard || "—"}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 uppercase">
            Stream
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {profile?.schoolStream || "—"}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 uppercase">
            Completion
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {profile?.expectedCompletionYear || "—"}
          </p>
        </div>
      </>
    )}

    {/* COLLEGE */}
    {isCollegeStudent && (
      <>
        <div>
          <p className="text-[10px] text-slate-400 uppercase">
            Branch
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {profile?.branch || "—"}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 uppercase">
            Year
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {profile?.currentYear
              ? `Year ${profile.currentYear}`
              : "—"}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 uppercase">
            Semester
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {profile?.currentSemester
              ? `Semester ${profile.currentSemester}`
              : "—"}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 uppercase">
            Backlogs
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {profile?.backlogs ?? 0}
          </p>
        </div>
      </>
    )}

    {/* GRADUATE */}
    {isGraduate && (
      <>
        <div>
          <p className="text-[10px] text-slate-400 uppercase">
            Qualification
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {profile?.highestQualification || "—"}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 uppercase">
            Branch
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {profile?.branch || "—"}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 uppercase">
            Graduation
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {profile?.graduationYear || "—"}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 uppercase">
            Status
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {profile?.employmentStatus || "—"}
          </p>
        </div>
      </>
    )}
  </div>
</div>


{/* Academic Profile Summary */}
<div className="bg-white rounded-2xl border border-slate-200 p-5">
  <div className="flex items-center justify-between mb-5">
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        Academic Profile
      </p>

      <h3 className="text-lg font-bold text-slate-800 mt-1">
        Your Profile Information
      </h3>
    </div>

    <button
      type="button"
      onClick={() => navigate("/profile")}
      className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
    >
      Edit Profile
      <ChevronRight className="w-3.5 h-3.5" />
    </button>
  </div>

  {profileLoading ? (
    <div className="py-8 text-center text-sm text-slate-400">
      Loading academic profile...
    </div>
  ) : !profile ? (
    <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 text-center">
      <p className="text-sm font-medium text-slate-700">
        Academic profile not completed
      </p>

      <p className="text-xs text-slate-400 mt-1">
        Complete your profile to get personalized opportunities.
      </p>

      <button
        type="button"
        onClick={() => navigate("/profile")}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
      >
        Complete Profile
      </button>
    </div>
  ) : (
    <div className="space-y-5">

      {/* Profile Identity */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
          <UserCheck className="w-5 h-5 text-blue-600" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800">
            {profile.educationLevel === "school"
              ? `Class ${profile.schoolClass || "—"} Student`
              : profile.educationLevel === "college"
              ? `${profile.degree || "College Student"}`
              : profile.educationLevel === "graduate"
              ? `${profile.degree || profile.highestQualification || "Graduate"}`
              : "Student"}
          </p>

          <p className="text-xs text-slate-500 truncate">
            {profile.institutionName || "Institution not added"}
          </p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Education Level */}
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            Education Level
          </p>

          <p className="text-sm font-semibold text-slate-700 mt-1 capitalize">
            {profile.educationLevel || "—"}
          </p>
        </div>

        {/* Institution */}
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            Institution
          </p>

          <p className="text-sm font-semibold text-slate-700 mt-1 truncate">
            {profile.institutionName || "—"}
          </p>
        </div>

        {/* Location */}
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            Location
          </p>

          <p className="text-sm font-semibold text-slate-700 mt-1">
            {profile.city && profile.state
              ? `${profile.city}, ${profile.state}`
              : profile.city || profile.state || "—"}
          </p>
        </div>

        {/* Academic Score */}
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            Academic Score
          </p>

          <p className="text-sm font-semibold text-slate-700 mt-1">
            {profile.academicScore
              ? `${profile.academicScore}${
                  profile.academicScoreType
                    ? ` ${profile.academicScoreType}`
                    : ""
                }`
              : "—"}
          </p>
        </div>

        {/* SCHOOL */}
        {isSchoolStudent && (
          <>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Board
              </p>

              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.schoolBoard || "—"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Stream
              </p>

              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.schoolStream || "—"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Subjects
              </p>

              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.schoolSubjects &&
                profile.schoolSubjects.length > 0
                  ? profile.schoolSubjects.join(", ")
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Completion Year
              </p>

              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.expectedCompletionYear || "—"}
              </p>
            </div>
          </>
        )}

        {/* COLLEGE */}
        {isCollegeStudent && (
          <>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Branch
              </p>

              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.branch || "—"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Current Year
              </p>

              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.currentYear
                  ? `Year ${profile.currentYear}`
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Semester
              </p>

              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.currentSemester
                  ? `Semester ${profile.currentSemester}`
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Backlogs
              </p>

              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.backlogs ?? 0}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Expected Graduation
              </p>

              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.expectedGraduationYear || "—"}
              </p>
            </div>
          </>
        )}

        {/* GRADUATE */}
        {isGraduate && (
          <>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Qualification
              </p>

              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.highestQualification || "—"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Branch
              </p>

              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.branch || "—"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Graduation Year
              </p>

              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.graduationYear || "—"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Employment
              </p>

              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.employmentStatus || "—"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Interests & Goals */}
      {(profile.academicInterests || profile.careerGoals) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">

          {profile.academicInterests && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Academic Interests
              </p>

              <p className="text-sm text-slate-600 mt-1">
                {profile.academicInterests}
              </p>
            </div>
          )}

          {profile.careerGoals && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Career Goals
              </p>

              <p className="text-sm text-slate-600 mt-1">
                {profile.careerGoals}
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  )}
</div>

{/* Education-Aware Actions */}
<div className="bg-white rounded-2xl border border-slate-200 p-5">
  <div className="mb-5">
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
      Recommended Actions
    </p>

    <h3 className="text-lg font-bold text-slate-800 mt-1">
      Explore opportunities for you
    </h3>

    <p className="text-sm text-slate-500 mt-1">
      Your dashboard is adapted to your education level.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

    {/* School */}
    {isSchoolStudent && (
      <>
        <button
          type="button"
          className="group text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mt-3">
            Explore Exams
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            Discover exams relevant to your class and subjects.
          </p>

          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600">
            Explore
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <button
          type="button"
          className="group text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-600" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mt-3">
            Scholarships
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            Find scholarships available for school students.
          </p>

          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600">
            Explore
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>

        <button
          type="button"
          className="group text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mt-3">
            Competitions
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            Discover olympiads and student competitions.
          </p>

          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600">
            Explore
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>

        <button
          type="button"
          className="group text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mt-3">
            Career Paths
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            Explore career options based on your interests.
          </p>

          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600">
            Explore
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </>
    )}

    {/* College */}
    {isCollegeStudent && (
      <>
        <button
          type="button"
          className="group text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <BriefcaseBusiness className="w-5 h-5 text-blue-600" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mt-3">
            Internships
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            Find internships matching your degree and branch.
          </p>

          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600">
            Explore
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>

        <button
          type="button"
          className="group text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-600" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mt-3">
            Scholarships
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            Discover scholarships you're eligible for.
          </p>

          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600">
            Explore
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>

        <button
          type="button"
          className="group text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mt-3">
            Competitive Exams
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            Explore exams based on your qualification and branch.
          </p>

          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600">
            Explore
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>

        <button
          type="button"
          className="group text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Ribbon className="w-5 h-5 text-emerald-600" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mt-3">
            Certifications
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            Build skills with relevant certifications.
          </p>

          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600">
            Explore
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </>
    )}

    {/* Graduate */}
    {isGraduate && (
      <>
        <button
          type="button"
          className="group text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <BriefcaseBusiness className="w-5 h-5 text-blue-600" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mt-3">
            Jobs
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            Discover jobs matching your qualification and skills.
          </p>

          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600">
            Explore
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>

        <button
          type="button"
          className="group text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mt-3">
            Government Exams
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            Explore government exams relevant to your qualification.
          </p>

          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600">
            Explore
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>

        <button
          type="button"
          className="group text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-600" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mt-3">
            Certifications
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            Find certifications to strengthen your profile.
          </p>

          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600">
            Explore
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>

        <button
          type="button"
          className="group text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-emerald-600" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mt-3">
            Higher Studies
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            Explore higher-study opportunities and entrance exams.
          </p>

          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600">
            Explore
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </>
    )}

  </div>
</div>




          {/* Grid Section: Banner + Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Opportunity Banner */}
            <div className="lg:col-span-2 bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row text-white">
              <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-3">
                    Featured Opportunity
                  </span>
                  <h2 className="text-xl font-bold leading-tight">Global Excellence Scholarship 2024</h2>
                  <p className="text-xs text-blue-100 mt-2 leading-relaxed">
                    Get up to $25,000 in funding for your final year of undergraduate studies. Matches your academic record in Computer Science.
                  </p>
                </div>
                <div>
                  <div className="flex gap-8 mb-4 border-t border-blue-500/40 pt-4">
                    <div>
                      <p className="text-[10px] text-blue-200 uppercase tracking-wider">AWARD AMOUNT</p>
                      <p className="text-lg font-bold">$25,000</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-200 uppercase tracking-wider">APPLICATION ENDS</p>
                      <p className="text-lg font-bold">Oct 15</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-50">Apply Now</button>
                    <button className="px-4 py-2 border border-white/30 text-white text-xs font-semibold rounded-lg hover:bg-white/10">Save for Later</button>
                  </div>
                </div>
              </div>
              <div className="md:w-2/5 relative min-h-[200px]">
                <img
                  src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop"
                  alt="Scholarship"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
                />
              </div>
            </div>

            {/* Upcoming Deadlines Sidebar Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <h3 className="font-bold text-slate-800 text-sm">Upcoming Deadlines</h3>
                  <p className="text-xs text-slate-500">Don't miss these critical dates</p>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Profile Verification", desc: "Compliance • Due Sep 28", urgent: true },
                    { title: "Stanford Scholarship", desc: "Scholarship • Due Oct 05", urgent: false },
                    { title: "Mock Exam Session", desc: "Academic • Due Oct 12", urgent: false },
                    { title: "Course Enrollment", desc: "Registration • Due Oct 20", urgent: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                          <p className="text-[10px] text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                      {item.urgent && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">Urgent</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <a href="#" className="block text-center text-xs text-slate-500 hover:text-slate-700 mt-4 font-medium">View full academic calendar</a>
            </div>
          </div>

          {/* Recommended Courses Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">RECOMMENDED COURSES</h3>
              <a href="#" className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline">
                Explore All <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CourseCard
                tag="Advanced"
                provider="MIT OPENCOURSEWARE"
                title="Advanced Data Structures"
                duration="12 Weeks"
                rating="4.9"
                image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop"
              />
              <CourseCard
                tag="Beginner"
                provider="STANFORD ONLINE"
                title="Global Economics 101"
                duration="8 Weeks"
                rating="4.7"
                image="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop"
              />
            </div>
          </div>

          {/* Bottom Grid: Eligible Exams & Quick Access/Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Eligible Exams Section */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Eligible Exams & Certifications</h3>
                <a href="#" className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline">
                  Manage Vouchers <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ExamCard
                  image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop"
                  tag="Registration Open"
                  title="IELTS Academic Prep"
                  date="Next Session: Oct 24, 2024"
                  price="2000"
                />
                <ExamCard
                  image="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop"
                  tag="Eligible"
                  title="GRE General Test"
                  date="Next Session: Nov 12, 2024"
                  price="1500"
                />
              </div>
            </div>

            {/* Quick Access & Alerts */}
            <div className="space-y-4">
              {/* Quick Access */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs mb-3">Quick Access</h4>
                <div className="space-y-2">
                  <a href="#" className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs font-medium text-slate-700">
                    <span className="flex items-center gap-2"><ExternalLink className="w-3.5 h-3.5 text-blue-600" /> Official Portal</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs font-medium text-slate-700">
                    <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-blue-600" /> My Wishlist</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs font-medium text-slate-700">
                    <span className="flex items-center gap-2"><Award className="w-3.5 h-3.5 text-blue-600" /> Applied Status</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">2 In Review</span>
                  </a>
                </div>
              </div>

              {/* Alerts Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Alerts Active</h5>
                    <p className="text-[10px] text-slate-500">Real-time matching is on</p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 my-3">
  <div
    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
    style={{ width: `${profileCompletion}%` }}
  />
</div>

<p className="text-[10px] text-slate-500 mb-3">
  {profileLoading
    ? "Calculating profile completion..."
    : `${profileCompletion}% Profile Completion`}
</p>
                <button
  type="button"
  onClick={() => navigate("/profile")}
  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm"
>
  Update Profile
</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-components
function StatCard({ icon, badgeText, title, value }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">{icon}</div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 tracking-wider">
          {badgeText}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{title}</p>
        <p className="text-xl font-extrabold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function CourseCard({ tag, provider, title, duration, rating, image }: CourseProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
      <div className="relative h-36">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
          {tag}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{provider}</p>
          <h4 className="font-bold text-slate-800 text-sm mt-0.5">{title}</h4>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {duration}</span>
            <span className="flex items-center gap-1 font-semibold text-slate-700"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {rating}</span>
          </div>
        </div>
        <button className="w-full mt-4 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700">
          Start Learning
        </button>
      </div>
    </div>
  );
}

function ExamCard({ image, tag, title, date, price }: ExamProps) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200 flex gap-3 items-center">
      <img src={image} alt={title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
          {tag}
        </span>
        <h4 className="font-bold text-xs text-slate-800 truncate">{title}</h4>
        <p className="text-[10px] text-slate-400">{date}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-bold text-blue-600">{price}</span>
          <button className="text-[10px] font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 px-2 py-1 rounded-lg">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
