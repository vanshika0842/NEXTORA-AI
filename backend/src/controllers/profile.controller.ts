import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  getStudentProfile,
  upsertStudentProfile,
  StudentProfileInput,
} from "../services/profile.service";

export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const profile = await getStudentProfile(req.userId);

    return res.status(200).json({
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch profile",
    });
  }
};

export const saveProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const body = req.body ?? {};

    // =====================================================
    // EDUCATION STAGE
    // =====================================================

    const educationLevel =
      typeof body.educationLevel === "string"
        ? body.educationLevel.trim().toLowerCase()
        : null;

    const allowedEducationLevels = [
      "school",
      "college",
      "graduate",
    ];

    if (
      educationLevel &&
      !allowedEducationLevels.includes(educationLevel)
    ) {
      return res.status(400).json({
        message:
          "Education level must be school, college, or graduate",
      });
    }

    // =====================================================
    // NUMBER HELPERS
    // =====================================================

    const parseOptionalNumber = (
  value: unknown
): number | null | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
};

    const expectedCompletionYear =
      parseOptionalNumber(
        body.expectedCompletionYear
      );

    const currentYear =
      parseOptionalNumber(body.currentYear);

    const currentSemester =
      parseOptionalNumber(body.currentSemester);

    const expectedGraduationYear =
      parseOptionalNumber(
        body.expectedGraduationYear
      );

    const graduationYear =
      parseOptionalNumber(body.graduationYear);

    const backlogs =
      parseOptionalNumber(body.backlogs);

    // =====================================================
    // VALIDATE NUMERIC VALUES
    // =====================================================
   const numericFields = [
  {
    name: "Expected completion year",
    rawValue: body.expectedCompletionYear,
    value: expectedCompletionYear,
  },
  {
    name: "Current year",
    rawValue: body.currentYear,
    value: currentYear,
  },
  {
    name: "Current semester",
    rawValue: body.currentSemester,
    value: currentSemester,
  },
  {
    name: "Expected graduation year",
    rawValue: body.expectedGraduationYear,
    value: expectedGraduationYear,
  },
  {
    name: "Graduation year",
    rawValue: body.graduationYear,
    value: graduationYear,
  },
  {
    name: "Backlogs",
    rawValue: body.backlogs,
    value: backlogs,
  },
];

const invalidNumber = numericFields.find(
  (field) =>
    field.rawValue !== undefined &&
    field.rawValue !== "" &&
    field.value === null
);

if (invalidNumber) {
  return res.status(400).json({
    message: `${invalidNumber.name} must be a valid number`,
  });
}
    

    // =====================================================
    // VALIDATE BACKLOGS
    // =====================================================

    if (
      backlogs !== null &&
      (!Number.isInteger(backlogs) || backlogs < 0)
    ) {
      return res.status(400).json({
        message:
          "Backlogs must be a non-negative whole number",
      });
    }

    // =====================================================
    // VALIDATE COLLEGE YEAR
    // =====================================================

    if (
      currentYear !== null &&
      (!Number.isInteger(currentYear) ||
        currentYear < 1 ||
        currentYear > 10)
    ) {
      return res.status(400).json({
        message:
          "Current year must be a valid whole number",
      });
    }

    // =====================================================
    // VALIDATE SEMESTER
    // =====================================================

    if (
      currentSemester !== null &&
      (!Number.isInteger(currentSemester) ||
        currentSemester < 1 ||
        currentSemester > 20)
    ) {
      return res.status(400).json({
        message:
          "Current semester must be a valid whole number",
      });
    }

    // =====================================================
    // VALIDATE SCHOOL SUBJECTS
    // =====================================================

    let schoolSubjects: string[] | null | undefined = undefined;

    if (body.schoolSubjects !== undefined) {
      if (!Array.isArray(body.schoolSubjects)) {
        return res.status(400).json({
          message: "School subjects must be an array",
        });
      }

      schoolSubjects = body.schoolSubjects
        .filter(
          (subject: unknown): subject is string =>
            typeof subject === "string"
        )
        .map((subject: string) => subject.trim())
        .filter(
          (subject: string) => subject.length > 0
        );

      if (schoolSubjects.length === 0) {
        schoolSubjects = null;
      }
    }

    // =====================================================
    // BUILD PROFILE DATA
    // =====================================================

    const profileData: StudentProfileInput = {
      // Education stage
      educationLevel,

      // Institution
      institutionName:
        body.institutionName,

      institutionType:
        body.institutionType ,

      state:
        body.state ,

      city:
        body.city,

      // School
      schoolClass:
        body.schoolClass ,

      schoolBoard:
        body.schoolBoard ,

      schoolStream:
        body.schoolStream ,

      schoolSubjects,

      expectedCompletionYear,

      // College
      degreeLevel:
        body.degreeLevel ,

      degree:
        body.degree ,

      branch:
        body.branch ,

      currentYear,

      currentSemester,

      expectedGraduationYear,

      // Academic performance
      academicScore:
        body.academicScore,

      academicScoreType:
        body.academicScoreType ,

      gpa:
        body.gpa ,

      backlogs,

      // Identification
      studentId:
        body.studentId ,

      // Graduate
      highestQualification:
        body.highestQualification ,

      graduationYear,

      employmentStatus:
        body.employmentStatus ,

      workExperience:
        body.workExperience ,

      // Interests & career
      academicInterests:
        body.academicInterests ,

      careerGoals:
        body.careerGoals ,
    };

    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const profile = await upsertStudentProfile(
      req.userId,
      profileData
    );

    return res.status(200).json({
      message: "Profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Save profile error:", error);

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to save profile",
    });
  }
};