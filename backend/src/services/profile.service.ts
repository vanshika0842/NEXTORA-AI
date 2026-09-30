import prisma from "../lib/prisma";

export interface StudentProfileInput {
  // EDUCATION STAGE
  educationLevel?: string | null;

  // INSTITUTION
  institutionName?: string | null;
  institutionType?: string | null;
  state?: string | null;
  city?: string | null;

  // SCHOOL
  schoolClass?: string | null;
  schoolBoard?: string | null;
  schoolStream?: string | null;
  schoolSubjects?: string[] | null;
  expectedCompletionYear?: number | null;

  // COLLEGE
  degreeLevel?: string | null;
  degree?: string | null;
  branch?: string | null;
  currentYear?: number | null;
  currentSemester?: number | null;
  expectedGraduationYear?: number | null;

  // ACADEMIC PERFORMANCE
  academicScore?: string | null;
  academicScoreType?: string | null;
  gpa?: string | null;
  backlogs?: number | null;

  // STUDENT IDENTIFICATION
  studentId?: string | null;

  // GRADUATE
  highestQualification?: string | null;
  graduationYear?: number | null;
  employmentStatus?: string | null;
  workExperience?: string | null;

  // INTERESTS & CAREER
  academicInterests?: string | null;
  careerGoals?: string | null;
}

/**
 * Converts empty strings into null.
 * Keeps meaningful strings unchanged.
 */
const normalizeString = (
  value?: string | null
): string | null | undefined => {
  // Field was not provided → don't update it
  if (value === undefined) {
    return undefined;
  }

  // Field was explicitly cleared
  if (value === null) {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? null : trimmedValue;
};

/**
 * Converts an optional number safely.
 */
const normalizeNumber = (
  value?: number | null
): number | null | undefined => {
  // Field was not provided → don't update it
  if (value === undefined) {
    return undefined;
  }

  // Field was explicitly cleared
  if (value === null) {
    return null;
  }

  if (Number.isNaN(value)) {
    return null;
  }

  return value;
};

/**
 * Normalizes school subjects.
 *
 * Example:
 * ["Physics", "Chemistry", "Mathematics"]
 *
 * Empty/invalid values are removed.
 */
const normalizeSubjects = (
  subjects?: string[] | null
): string[] | null | undefined => {
  // Field was not provided → don't update it
  if (subjects === undefined) {
    return undefined;
  }

  // Field was explicitly cleared
  if (subjects === null) {
    return null;
  }

  const cleanedSubjects = subjects
    .filter(
      (subject): subject is string =>
        typeof subject === "string"
    )
    .map((subject) => subject.trim())
    .filter((subject) => subject.length > 0);

  return cleanedSubjects.length > 0
    ? cleanedSubjects
    : null;
};

/**
 * Get the student's profile.
 */
export const getStudentProfile = async (
  userId: number
) => {
  const profile = await prisma.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};

/**
 * Create or update the student's profile.
 */
export const upsertStudentProfile = async (
  userId: number,
  data: StudentProfileInput
) => {
  // Make sure the user actually exists.
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const profile = await prisma.studentProfile.upsert({
    where: {
      userId,
    },

    // =====================================================
    // CREATE
    // =====================================================
    create: {
      userId,

      // EDUCATION STAGE
      educationLevel: normalizeString(
        data.educationLevel
      ),

      // INSTITUTION
      institutionName: normalizeString(
        data.institutionName
      ),
      institutionType: normalizeString(
        data.institutionType
      ),
      state: normalizeString(data.state),
      city: normalizeString(data.city),

      // SCHOOL
      schoolClass: normalizeString(data.schoolClass),
      schoolBoard: normalizeString(data.schoolBoard),
      schoolStream: normalizeString(data.schoolStream),

      schoolSubjects:
          normalizeSubjects(data.schoolSubjects),

      expectedCompletionYear: normalizeNumber(
        data.expectedCompletionYear
      ),

      // COLLEGE
      degreeLevel: normalizeString(data.degreeLevel),
      degree: normalizeString(data.degree),
      branch: normalizeString(data.branch),

      currentYear: normalizeNumber(data.currentYear),
      currentSemester: normalizeNumber(
        data.currentSemester
      ),

      expectedGraduationYear: normalizeNumber(
        data.expectedGraduationYear
      ),

      // ACADEMIC PERFORMANCE
      academicScore: normalizeString(data.academicScore),
      academicScoreType: normalizeString(
        data.academicScoreType
      ),
      gpa: normalizeString(data.gpa),
      backlogs: normalizeNumber(data.backlogs),

      // STUDENT IDENTIFICATION
      studentId: normalizeString(data.studentId),

      // GRADUATE
      highestQualification: normalizeString(
        data.highestQualification
      ),
      graduationYear: normalizeNumber(
        data.graduationYear
      ),
      employmentStatus: normalizeString(
        data.employmentStatus
      ),
      workExperience: normalizeString(
        data.workExperience
      ),

      // INTERESTS & CAREER
      academicInterests: normalizeString(
        data.academicInterests
      ),
      careerGoals: normalizeString(data.careerGoals),
    },

    // =====================================================
    // UPDATE
    // =====================================================
    update: {
      // EDUCATION STAGE
      educationLevel: normalizeString(
        data.educationLevel
      ),

      // INSTITUTION
      institutionName: normalizeString(
        data.institutionName
      ),
      institutionType: normalizeString(
        data.institutionType
      ),
      state: normalizeString(data.state),
      city: normalizeString(data.city),

      // SCHOOL
      schoolClass: normalizeString(data.schoolClass),
      schoolBoard: normalizeString(data.schoolBoard),
      schoolStream: normalizeString(data.schoolStream),

      schoolSubjects:
        normalizeSubjects(data.schoolSubjects),

      expectedCompletionYear: normalizeNumber(
        data.expectedCompletionYear
      ),

      // COLLEGE
      degreeLevel: normalizeString(data.degreeLevel),
      degree: normalizeString(data.degree),
      branch: normalizeString(data.branch),

      currentYear: normalizeNumber(data.currentYear),
      currentSemester: normalizeNumber(
        data.currentSemester
      ),

      expectedGraduationYear: normalizeNumber(
        data.expectedGraduationYear
      ),

      // ACADEMIC PERFORMANCE
      academicScore: normalizeString(data.academicScore),
      academicScoreType: normalizeString(
        data.academicScoreType
      ),
      gpa: normalizeString(data.gpa),
      backlogs: normalizeNumber(data.backlogs),

      // STUDENT IDENTIFICATION
      studentId: normalizeString(data.studentId),

      // GRADUATE
      highestQualification: normalizeString(
        data.highestQualification
      ),
      graduationYear: normalizeNumber(
        data.graduationYear
      ),
      employmentStatus: normalizeString(
        data.employmentStatus
      ),
      workExperience: normalizeString(
        data.workExperience
      ),

      // INTERESTS & CAREER
      academicInterests: normalizeString(
        data.academicInterests
      ),
      careerGoals: normalizeString(data.careerGoals),
    },
  });

  return profile;
};