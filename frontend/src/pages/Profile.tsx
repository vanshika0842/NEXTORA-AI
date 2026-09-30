import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { 
  GraduationCap, 
  LayoutDashboard, 
  UserCheck, 
  BookOpen, 
  Award, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  FileText, 
  Info,
  ChevronRight as ArrowRightIcon
} from 'lucide-react';

interface AcademicProfileState {
  educationLevel: string;

  institutionName: string;
  institutionType: string;
  state: string;
  city: string;

  schoolClass: string;
  schoolBoard: string;
  schoolStream: string;
  schoolSubjects: string[];
  expectedCompletionYear: string;

  degreeLevel: string;
  degree: string;
  branch: string;
  currentYear: string;
  currentSemester: string;
  expectedGraduationYear: string;

  academicScore: string;
  academicScoreType: string;
  gpa: string;
  backlogs: string;

  studentId: string;

  highestQualification: string;
  graduationYear: string;
  employmentStatus: string;
  workExperience: string;

  academicInterests: string;
  careerGoals: string;
}

type EducationLevel = "school" | "college" | "graduate";

type NumericProfileField =
  | "expectedCompletionYear"
  | "currentYear"
  | "currentSemester"
  | "expectedGraduationYear"
  | "backlogs"
  | "graduationYear";

type ValidationErrors = Partial<
  Record<keyof AcademicProfileState, string>
>;

interface SelectOption {
  value: string;
  label: string;
}

interface StudentProfileApiData {
  educationLevel?: string | null;

  institutionName?: string | null;
  institutionType?: string | null;
  state?: string | null;
  city?: string | null;

  schoolClass?: string | null;
  schoolBoard?: string | null;
  schoolStream?: string | null;
  schoolSubjects?: unknown;
  expectedCompletionYear?: number | string | null;

  degreeLevel?: string | null;
  degree?: string | null;
  branch?: string | null;
  currentYear?: number | string | null;
  currentSemester?: number | string | null;
  expectedGraduationYear?: number | string | null;

  academicScore?: string | null;
  academicScoreType?: string | null;
  gpa?: string | null;
  backlogs?: number | string | null;

  studentId?: string | null;

  highestQualification?: string | null;
  graduationYear?: number | string | null;
  employmentStatus?: string | null;
  workExperience?: string | null;

  academicInterests?: string | null;
  careerGoals?: string | null;
}

interface ProfileResponse {
  profile: StudentProfileApiData | null;
  message?: string;
}

type ProfilePayload = Partial<{
  educationLevel: string;

  institutionName: string;
  institutionType: string;
  state: string;
  city: string;

  schoolClass: string;
  schoolBoard: string;
  schoolStream: string;
  schoolSubjects: string[];
  expectedCompletionYear: number;

  degreeLevel: string;
  degree: string;
  branch: string;
  currentYear: number;
  currentSemester: number;
  expectedGraduationYear: number;

  academicScore: string;
  academicScoreType: string;
  backlogs: number;

  studentId: string;

  highestQualification: string;
  graduationYear: number;
  employmentStatus: string;
  workExperience: string;

  academicInterests: string;
  careerGoals: string;
}>;

interface FieldErrorProps {
  message?: string;
}

interface TextFieldProps {
  label: string;
  name: keyof AcademicProfileState;
  value: string;
  onChange: (field: keyof AcademicProfileState, value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  list?: string;
  min?: number;
  max?: number;
}

interface TextareaFieldProps {
  label: string;
  name: keyof AcademicProfileState;
  value: string;
  onChange: (field: keyof AcademicProfileState, value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

interface SelectFieldProps {
  label: string;
  name: keyof AcademicProfileState;
  value: string;
  options: SelectOption[];
  onChange: (field: keyof AcademicProfileState, value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const DEFAULT_PROFILE: AcademicProfileState = {
  educationLevel: "college",

  institutionName: "",
  institutionType: "",
  state: "",
  city: "",

  schoolClass: "",
  schoolBoard: "",
  schoolStream: "",
  schoolSubjects: [],
  expectedCompletionYear: "",

  degreeLevel: "",
  degree: "",
  branch: "",
  currentYear: "",
  currentSemester: "",
  expectedGraduationYear: "",

  academicScore: "",
  academicScoreType: "",
  gpa: "",
  backlogs: "",

  studentId: "",

  highestQualification: "",
  graduationYear: "",
  employmentStatus: "",
  workExperience: "",

  academicInterests: "",
  careerGoals: "",
};

const EDUCATION_LEVEL_OPTIONS: SelectOption[] = [
  { value: "school", label: "School Student" },
  {
    value: "college",
    label: "College / University Student",
  },
  { value: "graduate", label: "Graduate" },
];

const SCHOOL_INSTITUTION_TYPES: SelectOption[] = [
  { value: "School", label: "School" },
  { value: "Private School", label: "Private School" },
  {
    value: "Government School",
    label: "Government School",
  },
  {
    value: "International School",
    label: "International School",
  },
  { value: "Other", label: "Other" },
];

const HIGHER_ED_INSTITUTION_TYPES: SelectOption[] = [
  { value: "College", label: "College" },
  { value: "University", label: "University" },
  { value: "Institute", label: "Institute" },
  { value: "Other", label: "Other" },
];

const SCHOOL_CLASS_OPTIONS: SelectOption[] = [
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
];

const SCHOOL_BOARD_OPTIONS: SelectOption[] = [
  { value: "CBSE", label: "CBSE" },
  { value: "ICSE", label: "ICSE" },
  { value: "State Board", label: "State Board" },
  { value: "IB", label: "IB" },
  { value: "Cambridge", label: "Cambridge" },
  { value: "Other", label: "Other" },
];

const SCHOOL_STREAM_OPTIONS: SelectOption[] = [
  { value: "Science", label: "Science" },
  { value: "Commerce", label: "Commerce" },
  {
    value: "Arts / Humanities",
    label: "Arts / Humanities",
  },
  { value: "Vocational", label: "Vocational" },
  { value: "Other", label: "Other" },
];

const SCHOOL_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "Economics",
  "Accountancy",
  "Business Studies",
  "History",
  "Political Science",
  "Geography",
];

const DEGREE_LEVEL_OPTIONS: SelectOption[] = [
  { value: "Undergraduate", label: "Undergraduate" },
  { value: "Postgraduate", label: "Postgraduate" },
  { value: "Diploma", label: "Diploma" },
  { value: "Other", label: "Other" },
];

const DEGREE_OPTIONS = [
  "B.Tech",
  "B.E.",
  "BCA",
  "BBA",
  "B.Sc",
  "B.Com",
  "BA",
  "M.Tech",
  "MCA",
  "MBA",
  "M.Sc",
  "M.Com",
  "Diploma",
  "PhD",
];

const BRANCH_OPTIONS = [
  "Computer Science",
  "Information Technology",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Electronics",
  "Finance",
  "Marketing",
  "Business Administration",
];

const CURRENT_YEAR_OPTIONS: SelectOption[] = Array.from(
  { length: 10 },
  (_, index) => {
    const value = String(index + 1);

    return { value, label: value };
  }
);

const CURRENT_SEMESTER_OPTIONS: SelectOption[] = Array.from(
  { length: 20 },
  (_, index) => {
    const value = String(index + 1);

    return { value, label: value };
  }
);

const SCHOOL_SCORE_TYPE_OPTIONS: SelectOption[] = [
  { value: "Percentage", label: "Percentage" },
  { value: "Grade", label: "Grade" },
];

const HIGHER_ED_SCORE_TYPE_OPTIONS: SelectOption[] = [
  { value: "CGPA", label: "CGPA" },
  { value: "Percentage", label: "Percentage" },
  { value: "Grade", label: "Grade" },
];

const HIGHEST_QUALIFICATION_OPTIONS: SelectOption[] = [
  { value: "Diploma", label: "Diploma" },
  {
    value: "Bachelor's Degree",
    label: "Bachelor's Degree",
  },
  { value: "Master's Degree", label: "Master's Degree" },
  { value: "PhD", label: "PhD" },
  { value: "Other", label: "Other" },
];

const EMPLOYMENT_STATUS_OPTIONS: SelectOption[] = [
  { value: "Employed", label: "Employed" },
  { value: "Unemployed", label: "Unemployed" },
  { value: "Self-employed", label: "Self-employed" },
  { value: "Student", label: "Student" },
  {
    value: "Looking for opportunities",
    label: "Looking for opportunities",
  },
  { value: "Other", label: "Other" },
];

const INPUT_BASE_CLASS =
  "w-full rounded-xl border bg-slate-50/50 py-2.5 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1";

const INPUT_WITH_ICON_BASE_CLASS =
  "w-full rounded-xl border bg-slate-50/50 py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1";

const getInputClassName = (
  hasError: boolean,
  hasIcon = false
) => {
  const stateClass = hasError
    ? "border-red-200 focus:border-red-500 focus:ring-red-500"
    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500";

  return `${hasIcon ? INPUT_WITH_ICON_BASE_CLASS : INPUT_BASE_CLASS} ${stateClass}`;
};

const getValue = (
  value?: string | number | null
): string => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
};

const isEducationLevel = (
  value?: string | null
): value is EducationLevel => {
  return (
    value === "school" ||
    value === "college" ||
    value === "graduate"
  );
};

const normalizeSubjects = (subjects: unknown): string[] => {
  if (!Array.isArray(subjects)) {
    return [];
  }

  const selectedSubjects = new Set<string>();

  subjects.forEach((subject) => {
    if (typeof subject !== "string") {
      return;
    }

    const trimmedSubject = subject.trim();

    if (trimmedSubject) {
      selectedSubjects.add(trimmedSubject);
    }
  });

  return Array.from(selectedSubjects);
};

const mapProfileToState = (
  savedProfile: StudentProfileApiData
): AcademicProfileState => ({
  ...DEFAULT_PROFILE,
  educationLevel: isEducationLevel(savedProfile.educationLevel)
    ? savedProfile.educationLevel
    : DEFAULT_PROFILE.educationLevel,

  institutionName: getValue(savedProfile.institutionName),
  institutionType: getValue(savedProfile.institutionType),
  state: getValue(savedProfile.state),
  city: getValue(savedProfile.city),

  schoolClass: getValue(savedProfile.schoolClass),
  schoolBoard: getValue(savedProfile.schoolBoard),
  schoolStream: getValue(savedProfile.schoolStream),
  schoolSubjects: normalizeSubjects(
    savedProfile.schoolSubjects
  ),
  expectedCompletionYear: getValue(
    savedProfile.expectedCompletionYear
  ),

  degreeLevel: getValue(savedProfile.degreeLevel),
  degree: getValue(savedProfile.degree),
  branch: getValue(savedProfile.branch),
  currentYear: getValue(savedProfile.currentYear),
  currentSemester: getValue(savedProfile.currentSemester),
  expectedGraduationYear: getValue(
    savedProfile.expectedGraduationYear
  ),

  academicScore: getValue(savedProfile.academicScore),
  academicScoreType: getValue(
    savedProfile.academicScoreType
  ),
  gpa: getValue(savedProfile.gpa),
  backlogs: getValue(savedProfile.backlogs),

  studentId: getValue(savedProfile.studentId),

  highestQualification: getValue(
    savedProfile.highestQualification
  ),
  graduationYear: getValue(savedProfile.graduationYear),
  employmentStatus: getValue(
    savedProfile.employmentStatus
  ),
  workExperience: getValue(savedProfile.workExperience),

  academicInterests: getValue(
    savedProfile.academicInterests
  ),
  careerGoals: getValue(savedProfile.careerGoals),
});

const isBlank = (value: string): boolean =>
  value.trim() === "";

const parseWholeNumber = (
  value: string
): number | undefined => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const parsedValue = Number(trimmedValue);

  return Number.isInteger(parsedValue)
    ? parsedValue
    : undefined;
};

const validateWholeNumberField = (
  errors: ValidationErrors,
  field: NumericProfileField,
  label: string,
  value: string,
  required: boolean,
  minValue = 1,
  maxValue?: number
) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    if (required) {
      errors[field] = `${label} is required.`;
    }

    return;
  }

  const parsedValue = Number(trimmedValue);

  if (!Number.isInteger(parsedValue)) {
    errors[field] = `${label} must be a valid whole number.`;
    return;
  }

  if (parsedValue < minValue) {
    errors[field] = `${label} cannot be less than ${minValue}.`;
    return;
  }

  if (
    maxValue !== undefined &&
    parsedValue > maxValue
  ) {
    errors[field] = `${label} cannot be greater than ${maxValue}.`;
  }
};

const validateProfile = (
  profile: AcademicProfileState
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!isEducationLevel(profile.educationLevel)) {
    errors.educationLevel =
      "Education level must be school, college, or graduate.";
  }

  if (isBlank(profile.institutionName)) {
    errors.institutionName = "Institution name is required.";
  }

  if (profile.educationLevel === "school") {
    if (isBlank(profile.schoolClass)) {
      errors.schoolClass = "Current class is required.";
    }

    if (isBlank(profile.schoolBoard)) {
      errors.schoolBoard = "Board is required.";
    }

    if (
      (profile.schoolClass === "11" ||
        profile.schoolClass === "12") &&
      isBlank(profile.schoolStream)
    ) {
      errors.schoolStream =
        "Stream is required for class 11 and 12.";
    }

    if (profile.schoolSubjects.length === 0) {
      errors.schoolSubjects =
        "Select at least one subject.";
    }

    if (isBlank(profile.academicScore)) {
      errors.academicScore = "Academic score is required.";
    }

    validateWholeNumberField(
      errors,
      "expectedCompletionYear",
      "Expected completion year",
      profile.expectedCompletionYear,
      true
    );
  }

  if (profile.educationLevel === "college") {
    if (isBlank(profile.degreeLevel)) {
      errors.degreeLevel = "Degree level is required.";
    }

    if (isBlank(profile.degree)) {
      errors.degree = "Degree is required.";
    }

    if (isBlank(profile.branch)) {
      errors.branch = "Branch or field of study is required.";
    }

    validateWholeNumberField(
      errors,
      "currentYear",
      "Current year",
      profile.currentYear,
      true,
      1,
      10
    );

    validateWholeNumberField(
      errors,
      "currentSemester",
      "Current semester",
      profile.currentSemester,
      true,
      1,
      20
    );

    validateWholeNumberField(
      errors,
      "expectedGraduationYear",
      "Expected graduation year",
      profile.expectedGraduationYear,
      true
    );

    if (isBlank(profile.academicScore)) {
      errors.academicScore = "Academic score is required.";
    }

    validateWholeNumberField(
      errors,
      "backlogs",
      "Backlogs",
      profile.backlogs,
      false,
      0
    );
  }

  if (profile.educationLevel === "graduate") {
    if (isBlank(profile.highestQualification)) {
      errors.highestQualification =
        "Highest qualification is required.";
    }

    if (isBlank(profile.degree)) {
      errors.degree = "Degree is required.";
    }

    if (isBlank(profile.branch)) {
      errors.branch = "Branch or field is required.";
    }

    validateWholeNumberField(
      errors,
      "graduationYear",
      "Graduation year",
      profile.graduationYear,
      true
    );

    if (isBlank(profile.academicScore)) {
      errors.academicScore =
        "Final academic score is required.";
    }

    if (isBlank(profile.employmentStatus)) {
      errors.employmentStatus =
        "Employment status is required.";
    }
  }

  return errors;
};

const buildProfilePayload = (
  profile: AcademicProfileState
): ProfilePayload => {
  const basePayload = {
    educationLevel: profile.educationLevel,
    institutionName: profile.institutionName,
    institutionType: profile.institutionType,
    state: profile.state,
    city: profile.city,
  };

  const interestsPayload = {
    academicInterests: profile.academicInterests,
    careerGoals: profile.careerGoals,
  };

  if (profile.educationLevel === "school") {
    return {
      ...basePayload,
      schoolClass: profile.schoolClass,
      schoolBoard: profile.schoolBoard,
      schoolStream: profile.schoolStream,
      schoolSubjects: profile.schoolSubjects,
      expectedCompletionYear: parseWholeNumber(
        profile.expectedCompletionYear
      ),
      academicScore: profile.academicScore,
      academicScoreType: profile.academicScoreType,
      ...interestsPayload,
    };
  }

  if (profile.educationLevel === "graduate") {
    return {
      ...basePayload,
      highestQualification: profile.highestQualification,
      degree: profile.degree,
      branch: profile.branch,
      graduationYear: parseWholeNumber(
        profile.graduationYear
      ),
      academicScore: profile.academicScore,
      academicScoreType: profile.academicScoreType,
      studentId: profile.studentId,
      employmentStatus: profile.employmentStatus,
      workExperience: profile.workExperience,
      ...interestsPayload,
    };
  }

  return {
    ...basePayload,
    degreeLevel: profile.degreeLevel,
    degree: profile.degree,
    branch: profile.branch,
    currentYear: parseWholeNumber(profile.currentYear),
    currentSemester: parseWholeNumber(
      profile.currentSemester
    ),
    expectedGraduationYear: parseWholeNumber(
      profile.expectedGraduationYear
    ),
    academicScore: profile.academicScore,
    academicScoreType: profile.academicScoreType,
    backlogs: parseWholeNumber(profile.backlogs),
    studentId: profile.studentId,
    ...interestsPayload,
  };
};

const getApiErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: unknown;
          };
        };
      }
    ).response;

    if (typeof response?.data?.message === "string") {
      return response.data.message;
    }
  }

  return fallback;
};

const getInstitutionTypeOptions = (
  educationLevel: string
): SelectOption[] => {
  return educationLevel === "school"
    ? SCHOOL_INSTITUTION_TYPES
    : HIGHER_ED_INSTITUTION_TYPES;
};

const getProfileHeading = (
  educationLevel: string
): string => {
  if (educationLevel === "school") {
    return "School Information";
  }

  if (educationLevel === "graduate") {
    return "Graduate Information";
  }

  return "University Information";
};

const FieldError = ({ message }: FieldErrorProps) => {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-1 text-[10px] font-medium text-red-500">
      {message}
    </p>
  );
};

const FormSectionHeading = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <div>
    <h3 className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
      {title}
    </h3>
    {description && (
      <p className="mt-0.5 text-[11px] text-slate-400">
        {description}
      </p>
    )}
  </div>
);

const TextField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  error,
  icon,
  list,
  min,
  max,
}: TextFieldProps) => (
  <div>
    <label className="block text-xs font-semibold text-slate-700 mb-1">
      {label}
      {required && " *"}
    </label>
    {icon ? (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={(event) =>
            onChange(name, event.target.value)
          }
          placeholder={placeholder}
          list={list}
          min={min}
          max={max}
          aria-invalid={Boolean(error)}
          className={getInputClassName(Boolean(error), true)}
        />
      </div>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={(event) =>
          onChange(name, event.target.value)
        }
        placeholder={placeholder}
        list={list}
        min={min}
        max={max}
        aria-invalid={Boolean(error)}
        className={getInputClassName(Boolean(error))}
      />
    )}
    <FieldError message={error} />
  </div>
);

const TextareaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
}: TextareaFieldProps) => (
  <div>
    <label className="block text-xs font-semibold text-slate-700 mb-1">
      {label}
      {required && " *"}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={(event) => onChange(name, event.target.value)}
      placeholder={placeholder}
      rows={3}
      aria-invalid={Boolean(error)}
      className={`${getInputClassName(Boolean(error))} resize-none leading-relaxed`}
    />
    <FieldError message={error} />
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  required = false,
  error,
}: SelectFieldProps) => (
  <div>
    <label className="block text-xs font-semibold text-slate-700 mb-1">
      {label}
      {required && " *"}
    </label>
    <select
      name={name}
      value={value}
      onChange={(event) =>
        onChange(name, event.target.value)
      }
      aria-invalid={Boolean(error)}
      className={getInputClassName(Boolean(error))}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <FieldError message={error} />
  </div>
);

const SubjectCheckboxSection = ({
  selectedSubjects,
  onToggle,
  error,
}: {
  selectedSubjects: string[];
  onToggle: (subject: string) => void;
  error?: string;
}) => (
  <div>
    <label className="block text-xs font-semibold text-slate-700 mb-2">
      Subjects *
    </label>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {SCHOOL_SUBJECTS.map((subject) => (
        <label
          key={subject}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700"
        >
          <input
            type="checkbox"
            checked={selectedSubjects.includes(subject)}
            onChange={() => onToggle(subject)}
            className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          {subject}
        </label>
      ))}
    </div>
    <FieldError message={error} />
  </div>
);

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] =
    useState<AcademicProfileState>(DEFAULT_PROFILE);

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [message, setMessage] = useState("");
const [error, setError] = useState("");
const [validationErrors, setValidationErrors] =
  useState<ValidationErrors>({});

  const updateProfileField = (
    field: keyof AcademicProfileState,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));

    setValidationErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[field];

      return nextErrors;
    });

    setMessage("");
    setError("");
  };

  const handleSubjectToggle = (subject: string) => {
    setProfile((prev) => {
      const hasSubject =
        prev.schoolSubjects.includes(subject);

      return {
        ...prev,
        schoolSubjects: hasSubject
          ? prev.schoolSubjects.filter(
              (selectedSubject) =>
                selectedSubject !== subject
            )
          : [...prev.schoolSubjects, subject],
      };
    });

    setValidationErrors((prev) => {
      if (!prev.schoolSubjects) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors.schoolSubjects;

      return nextErrors;
    });

    setMessage("");
    setError("");
  };

useEffect(() => {
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<ProfileResponse>("/profile");

      const savedProfile = response.data.profile;

      if (savedProfile) {
        setProfile(mapProfileToState(savedProfile));
      }
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error
      );

      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  loadProfile();
}, []);

const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  const nextValidationErrors = validateProfile(profile);

  if (Object.keys(nextValidationErrors).length > 0) {
    setValidationErrors(nextValidationErrors);
    setMessage("");
    setError("Please fix the highlighted fields.");
    return;
  }

  try {
    setSaving(true);
    setMessage("");
    setError("");
    setValidationErrors({});

    const response = await api.put(
      "/profile",
      buildProfilePayload(profile)
    );

    const savedProfile =
      (response.data as ProfileResponse).profile;

    if (savedProfile) {
      setProfile(mapProfileToState(savedProfile));
    }

    setMessage("Profile saved successfully.");
  } catch (error: any) {
  console.error(
    "Failed to save profile:",
    error.response?.data || error
  );

  setError(
    error.response?.data?.message ||
    "Failed to save profile."
  );


    setError(
      getApiErrorMessage(
        error,
        "Failed to save profile."
      )
    );
  } finally {
    setSaving(false);
  }
};

if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-sm font-medium text-slate-500">
        Loading profile...
      </div>
    </div>
  );
}
  return (
    <div className="flex min-h-screen w-full bg-slate-50/50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col justify-between border-r border-slate-200 bg-white p-6 md:flex">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-500">Nextora</span>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            <Link to="/dashboard"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  >
           <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
            <Link
           to="/profile"
           className="flex items-center gap-3 rounded-xl bg-slate-100 px-3.5 py-2.5 text-sm font-semibold text-blue-600"
              >
            <UserCheck className="h-4 w-4" />
          Academic Profile
              </Link>
            <Link to="/opportunities" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <BookOpen className="h-4 w-4" />
              Opportunities
            </Link>
            <Link to="/opportunities?type=SCHOLARSHIP" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <Award className="h-4 w-4" />
              Scholarships
            </Link>
          </nav>
        </div>

        {/* Sidebar Bottom Nav */}
        <div className="space-y-1 border-t border-slate-100 pt-4">
          <a href="#" className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900">
            <Settings className="h-4 w-4" />
            Settings
          </a>
          <button
  type="button"
  onClick={logout}
  className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
>
  <LogOut className="h-4 w-4" />
  Log out
</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <span>ScholarPath</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-800">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources, exams..."
                className="w-64 rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <button className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                alt="Student Avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800">
  {user?.name || "Student"}
</p>

<p className="text-[10px] text-slate-400">
  {user?.email || "Student"}
</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8">
          {/* Main Title & Wizard Step Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Complete Your Academic Profile
              </h1>
              <p className="mt-1 max-w-2xl text-xs text-slate-500 leading-relaxed">
                Provide your academic details to unlock personalized scholarship opportunities, curated exam preparation materials, and university-specific benefits.
              </p>
            </div>

            {/* Wizard Steps indicator */}
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold">1</span>
                Basic Info
              </div>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <div className="flex items-center gap-2 font-bold text-blue-600">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">2</span>
                Academic
              </div>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <div className="flex items-center gap-2 text-slate-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold">3</span>
                Preferences
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                {/* Section Header */}
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                    <Building2 className="h-3.5 w-3.5" />
                    Education Profile
                  </div>
                  <h2 className="mt-1 text-base font-bold text-slate-900">
                    {getProfileHeading(profile.educationLevel)}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Keep your academic details structured so Nextora can match you with relevant opportunities.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4 border-b border-slate-100 pb-5">
                    <FormSectionHeading
                      title="Education Level"
                      description="Choose the profile type that matches your current stage."
                    />
                    <SelectField
                      label="Education Level"
                      name="educationLevel"
                      value={profile.educationLevel}
                      options={EDUCATION_LEVEL_OPTIONS}
                      onChange={updateProfileField}
                      placeholder="Select Education Level"
                      required
                      error={validationErrors.educationLevel}
                    />
                  </div>

                  <div className="space-y-4 border-b border-slate-100 pb-5">
                    <FormSectionHeading
                      title="Institution Information"
                      description="Tell us where this education stage belongs."
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <TextField
                        label="Institution Name"
                        name="institutionName"
                        value={profile.institutionName}
                        onChange={updateProfileField}
                        placeholder="Enter institution name"
                        required
                        error={validationErrors.institutionName}
                      />
                      <SelectField
                        label="Institution Type"
                        name="institutionType"
                        value={profile.institutionType}
                        options={getInstitutionTypeOptions(
                          profile.educationLevel
                        )}
                        onChange={updateProfileField}
                        placeholder="Select institution type"
                        error={validationErrors.institutionType}
                      />
                      <TextField
                        label="State"
                        name="state"
                        value={profile.state}
                        onChange={updateProfileField}
                        placeholder="State"
                        error={validationErrors.state}
                      />
                      <TextField
                        label="City"
                        name="city"
                        value={profile.city}
                        onChange={updateProfileField}
                        placeholder="City"
                        error={validationErrors.city}
                      />
                    </div>
                  </div>

                  {profile.educationLevel === "school" && (
                    <div className="space-y-4 border-b border-slate-100 pb-5">
                      <FormSectionHeading
                        title="Academic Information"
                        description="Class, board, stream, subjects, and performance."
                      />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <SelectField
                          label="Current Class"
                          name="schoolClass"
                          value={profile.schoolClass}
                          options={SCHOOL_CLASS_OPTIONS}
                          onChange={updateProfileField}
                          placeholder="Select class"
                          required
                          error={validationErrors.schoolClass}
                        />
                        <SelectField
                          label="Board"
                          name="schoolBoard"
                          value={profile.schoolBoard}
                          options={SCHOOL_BOARD_OPTIONS}
                          onChange={updateProfileField}
                          placeholder="Select board"
                          required
                          error={validationErrors.schoolBoard}
                        />
                        <SelectField
                          label="Stream"
                          name="schoolStream"
                          value={profile.schoolStream}
                          options={SCHOOL_STREAM_OPTIONS}
                          onChange={updateProfileField}
                          placeholder="Select stream"
                          required={
                            profile.schoolClass === "11" ||
                            profile.schoolClass === "12"
                          }
                          error={validationErrors.schoolStream}
                        />
                        <TextField
                          label="Expected Completion Year"
                          name="expectedCompletionYear"
                          value={profile.expectedCompletionYear}
                          onChange={updateProfileField}
                          placeholder="YYYY"
                          type="number"
                          min={1}
                          required
                          icon={
                            <Calendar className="h-3.5 w-3.5" />
                          }
                          error={
                            validationErrors.expectedCompletionYear
                          }
                        />
                      </div>
                      <SubjectCheckboxSection
                        selectedSubjects={profile.schoolSubjects}
                        onToggle={handleSubjectToggle}
                        error={validationErrors.schoolSubjects}
                      />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <TextField
                          label="Academic Score"
                          name="academicScore"
                          value={profile.academicScore}
                          onChange={updateProfileField}
                          placeholder="e.g. 88 or A"
                          required
                          error={validationErrors.academicScore}
                        />
                        <SelectField
                          label="Score Type"
                          name="academicScoreType"
                          value={profile.academicScoreType}
                          options={SCHOOL_SCORE_TYPE_OPTIONS}
                          onChange={updateProfileField}
                          placeholder="Select score type"
                          error={validationErrors.academicScoreType}
                        />
                      </div>
                    </div>
                  )}

                  {profile.educationLevel === "college" && (
                    <div className="space-y-4 border-b border-slate-100 pb-5">
                      <FormSectionHeading
                        title="Academic Information"
                        description="Degree, year, semester, score, and student identification."
                      />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <SelectField
                          label="Degree Level"
                          name="degreeLevel"
                          value={profile.degreeLevel}
                          options={DEGREE_LEVEL_OPTIONS}
                          onChange={updateProfileField}
                          placeholder="Select degree level"
                          required
                          error={validationErrors.degreeLevel}
                        />
                        <TextField
                          label="Degree"
                          name="degree"
                          value={profile.degree}
                          onChange={updateProfileField}
                          placeholder="e.g. B.Tech"
                          list="degree-options"
                          required
                          error={validationErrors.degree}
                        />
                        <TextField
                          label="Branch / Field of Study"
                          name="branch"
                          value={profile.branch}
                          onChange={updateProfileField}
                          placeholder="e.g. Computer Science"
                          list="branch-options"
                          required
                          error={validationErrors.branch}
                        />
                        <SelectField
                          label="Current Year"
                          name="currentYear"
                          value={profile.currentYear}
                          options={CURRENT_YEAR_OPTIONS}
                          onChange={updateProfileField}
                          placeholder="Select year"
                          required
                          error={validationErrors.currentYear}
                        />
                        <SelectField
                          label="Current Semester"
                          name="currentSemester"
                          value={profile.currentSemester}
                          options={CURRENT_SEMESTER_OPTIONS}
                          onChange={updateProfileField}
                          placeholder="Select semester"
                          required
                          error={validationErrors.currentSemester}
                        />
                        <TextField
                          label="Expected Graduation Year"
                          name="expectedGraduationYear"
                          value={profile.expectedGraduationYear}
                          onChange={updateProfileField}
                          placeholder="YYYY"
                          type="number"
                          min={1}
                          required
                          icon={
                            <Calendar className="h-3.5 w-3.5" />
                          }
                          error={
                            validationErrors.expectedGraduationYear
                          }
                        />
                        <TextField
                          label="Academic Score"
                          name="academicScore"
                          value={profile.academicScore}
                          onChange={updateProfileField}
                          placeholder="e.g. 8.4 or 82%"
                          required
                          error={validationErrors.academicScore}
                        />
                        <SelectField
                          label="Score Type"
                          name="academicScoreType"
                          value={profile.academicScoreType}
                          options={HIGHER_ED_SCORE_TYPE_OPTIONS}
                          onChange={updateProfileField}
                          placeholder="Select score type"
                          error={validationErrors.academicScoreType}
                        />
                        
                       <TextField
                          label="Backlogs"
                          name="backlogs"
                          value={profile.backlogs}
                          onChange={updateProfileField}
                          type="number"
                          min={0}
                          error={validationErrors.backlogs}
                        />
                      
                        <TextField
                          label="Student ID"
                          name="studentId"
                          value={profile.studentId}
                          onChange={updateProfileField}
                          placeholder="Registration number"
                          icon={
                            <FileText className="h-3.5 w-3.5" />
                          }
                          error={validationErrors.studentId}
                        />
                      </div>
                    </div>
                  )}

                  {profile.educationLevel === "graduate" && (
                    <>
                      <div className="space-y-4 border-b border-slate-100 pb-5">
                        <FormSectionHeading
                          title="Graduation Information"
                          description="Qualification, degree, field, graduation year, and final score."
                        />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <SelectField
                            label="Highest Qualification"
                            name="highestQualification"
                            value={profile.highestQualification}
                            options={HIGHEST_QUALIFICATION_OPTIONS}
                            onChange={updateProfileField}
                            placeholder="Select qualification"
                            required
                            error={
                              validationErrors.highestQualification
                            }
                          />
                          <TextField
                            label="Degree"
                            name="degree"
                            value={profile.degree}
                            onChange={updateProfileField}
                            placeholder="e.g. B.Tech"
                            list="degree-options"
                            required
                            error={validationErrors.degree}
                          />
                          <TextField
                            label="Branch / Field"
                            name="branch"
                            value={profile.branch}
                            onChange={updateProfileField}
                            placeholder="e.g. Computer Science"
                            list="branch-options"
                            required
                            error={validationErrors.branch}
                          />
                          <TextField
                            label="Graduation Year"
                            name="graduationYear"
                            value={profile.graduationYear}
                            onChange={updateProfileField}
                            placeholder="YYYY"
                            type="number"
                            min={1}
                            required
                            icon={
                              <Calendar className="h-3.5 w-3.5" />
                            }
                            error={validationErrors.graduationYear}
                          />
                          <TextField
                            label="Final Academic Score"
                            name="academicScore"
                            value={profile.academicScore}
                            onChange={updateProfileField}
                            placeholder="e.g. 8.6 or 84%"
                            required
                            error={validationErrors.academicScore}
                          />
                          <SelectField
                            label="Score Type"
                            name="academicScoreType"
                            value={profile.academicScoreType}
                            options={HIGHER_ED_SCORE_TYPE_OPTIONS}
                            onChange={updateProfileField}
                            placeholder="Select score type"
                            error={validationErrors.academicScoreType}
                          />
                        </div>
                      </div>

                      <div className="space-y-4 border-b border-slate-100 pb-5">
                        <FormSectionHeading
                          title="Career Information"
                          description="Current work status and experience."
                        />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <SelectField
                            label="Employment Status"
                            name="employmentStatus"
                            value={profile.employmentStatus}
                            options={EMPLOYMENT_STATUS_OPTIONS}
                            onChange={updateProfileField}
                            placeholder="Select employment status"
                            required
                            error={validationErrors.employmentStatus}
                          />
                          <TextField
                            label="Student ID"
                            name="studentId"
                            value={profile.studentId}
                            onChange={updateProfileField}
                            placeholder="Registration number"
                            icon={
                              <FileText className="h-3.5 w-3.5" />
                            }
                            error={validationErrors.studentId}
                          />
                        </div>
                        <TextareaField
                          label="Work Experience"
                          name="workExperience"
                          value={profile.workExperience}
                          onChange={updateProfileField}
                          placeholder="Summarize your relevant work experience"
                          error={validationErrors.workExperience}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-4">
                    <FormSectionHeading
                      title="Interests & Career"
                      description="These details improve scholarship and opportunity matching."
                    />
                    <TextareaField
                      label="Academic Interests"
                      name="academicInterests"
                      value={profile.academicInterests}
                      onChange={updateProfileField}
                      placeholder="e.g. Artificial Intelligence, Global Markets, Public Policy"
                      error={validationErrors.academicInterests}
                    />
                    <TextareaField
                      label="Career Goals"
                      name="careerGoals"
                      value={profile.careerGoals}
                      onChange={updateProfileField}
                      placeholder="Describe the roles, fields, or opportunities you want to pursue"
                      error={validationErrors.careerGoals}
                    />
                  </div>
                </div>

                <datalist id="degree-options">
                  {DEGREE_OPTIONS.map((degree) => (
                    <option key={degree} value={degree} />
                  ))}
                </datalist>

                <datalist id="branch-options">
                  {BRANCH_OPTIONS.map((branch) => (
                    <option key={branch} value={branch} />
                  ))}
                </datalist>

{message && (
  <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
    {message}
  </div>
)}

{error && (
  <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
    {error}
  </div>
)}
                {/* Submit Actions */}
                <div className="mt-8 flex items-center justify-end gap-4 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Skip for now
                  </button>
             <button
  type="submit"
  disabled={saving}
  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
>
  {saving ? "Saving profile..." : "Save & Continue"}

  {!saving && (
    <ArrowRightIcon className="h-3.5 w-3.5" />
  )}
</button>
                </div>
              </form>

              {/* Verification Notice Banner */}
              <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-semibold text-blue-900">Verification Required</h4>
                  <p className="mt-0.5 text-blue-700/80 leading-relaxed">
                    To access university-exclusive discounts and scholarships, you will be required to upload a valid student ID or transcript in the next step. Please ensure your university name matches exactly.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side Info Cards & Help */}
            <div className="space-y-6">
              {/* Illustration Card */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"
                  alt="Studying Illustration"
                  className="mx-auto h-40 w-full object-cover rounded-xl mb-4"
                />
                <p className="text-xs font-semibold italic text-slate-600">
                  "Excellence is not an act, but a habit."
                </p>
              </div>

              {/* Benefits Box */}
              <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                <h3 className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">
                  Benefits of a Complete Profile
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">Personalized Scholarships</h4>
                      <p className="text-[11px] text-slate-400">Match with over $50k in grants relevant to your major.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">Exam Strategy Guides</h4>
                      <p className="text-[11px] text-slate-400">Unlock curated resources specifically for your university's curriculum.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">Campus Partnership Access</h4>
                      <p className="text-[11px] text-slate-400">Access exclusive local student benefits based on your location.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help / Contact Support Box */}
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                <div className="flex justify-center -space-x-1 mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 ring-2 ring-white">AJ</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 ring-2 ring-white">SK</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700 ring-2 ring-white">ML</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">Need help with your profile?</h4>
                <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                  Our academic advisors are available 24/7 to guide you through the process.
                </p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  Contact Advisor
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto flex items-center justify-between border-t border-slate-200 bg-white px-8 py-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-slate-700">Nextora</span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Academic Terms</a>
            <a href="#" className="hover:text-slate-600">Support Center</a>
          </div>
© 2026 Nextora. Helping students discover their next opportunity.
        </footer>
      </div>
    </div>
  );
};

export default Profile;
