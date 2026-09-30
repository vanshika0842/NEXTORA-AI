export const OpportunityType = {
  EXAM: "EXAM",
  SCHOLARSHIP: "SCHOLARSHIP",
  COURSE: "COURSE",
  INTERNSHIP: "INTERNSHIP",
  CERTIFICATION: "CERTIFICATION",
  COMPETITION: "COMPETITION",
  RESEARCH: "RESEARCH",
  FELLOWSHIP: "FELLOWSHIP",
  CAREER_PROGRAM: "CAREER_PROGRAM",
  INTERNATIONAL: "INTERNATIONAL",
} as const;

export type OpportunityType =
  (typeof OpportunityType)[keyof typeof OpportunityType];

export const OpportunityStatus = {
  UPCOMING: "UPCOMING",
  OPEN: "OPEN",
  CLOSING_SOON: "CLOSING_SOON",
  CLOSED: "CLOSED",
  ARCHIVED: "ARCHIVED",
} as const;

export type OpportunityStatus =
  (typeof OpportunityStatus)[keyof typeof OpportunityStatus];

export type OpportunitySortOption = "DEADLINE" | "RECENT" | "TITLE";

export interface ExamDetails {
  id: number;
  opportunityId: number;
  examDate: string | null;
  examMode: string | null;
  conductingBody: string | null;
  applicationFee: string | null;
  ageLimit: string | null;
  numberOfAttempts: string | null;
  eligibilityText: string | null;
  syllabusUrl: string | null;
  notificationUrl: string | null;
}

export interface ScholarshipDetails {
  id: number;
  opportunityId: number;
  awardAmount: string | null;
  awardType: string | null;
  incomeLimit: string | null;
  academicRequirement: string | null;
  categoryRequirement: string | null;
  benefits: string | null;
  requiredDocuments: string | null;
}

export interface CourseDetails {
  id: number;
  opportunityId: number;
  duration: string | null;
  level: string | null;
  mode: string | null;
  price: string | null;
  rating: number | null;
  certificate: boolean;
  skills: string[];
  startDate: string | null;
}

export interface InternshipDetails {
  id: number;
  opportunityId: number;
  role: string | null;
  duration: string | null;
  stipend: string | null;
  workMode: string | null;
  experienceLevel: string | null;
  skills: string[];
  startDate: string | null;
}

export interface CertificationDetails {
  id: number;
  opportunityId: number;
  provider: string | null;
  level: string | null;
  duration: string | null;
  price: string | null;
  certificateType: string | null;
  skills: string[];
}

export interface CompetitionDetails {
  id: number;
  opportunityId: number;
  competitionDate: string | null;
  registrationDeadline: string | null;
  teamBased: boolean;
  teamSize: string | null;
  prizeDetails: string | null;
  participationMode: string | null;
  themes: string[];
}

export interface ResearchDetails {
  id: number;
  opportunityId: number;
  researchArea: string | null;
  duration: string | null;
  stipend: string | null;
  facultyRequired: boolean;
  skills: string[];
  eligibilityText: string | null;
}

export interface FellowshipDetails {
  id: number;
  opportunityId: number;
  duration: string | null;
  stipend: string | null;
  fellowshipAmount: string | null;
  eligibilityText: string | null;
  benefits: string | null;
}

export interface Opportunity {
  id: number;
  title: string;
  organization: string;
  type: OpportunityType;
  description: string | null;
  location: string | null;
  isRemote: boolean;
  applicationStartDate: string | null;
  applicationDeadline: string | null;
  status: OpportunityStatus;
  sourceName: string | null;
  lastVerifiedAt: string | null;
  createdAt: string;
  officialUrl?: string | null;
  applicationUrl?: string | null;
  sourceUrl?: string | null;
  updatedAt?: string;
  examDetails?: ExamDetails;
  scholarshipDetails?: ScholarshipDetails;
  courseDetails?: CourseDetails;
  internshipDetails?: InternshipDetails;
  certificationDetails?: CertificationDetails;
  competitionDetails?: CompetitionDetails;
  researchDetails?: ResearchDetails;
  fellowshipDetails?: FellowshipDetails;
}

export interface OpportunityPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OpportunityListResponse {
  data: Opportunity[];
  pagination: OpportunityPagination;
}

export interface OpportunityQueryParams {
  search?: string;
  type?: OpportunityType | "";
  status?: OpportunityStatus | "";
  location?: string;
  remote?: "true" | "false" | "";
  sort?: OpportunitySortOption;
  page?: number;
  limit?: number;
}
