import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting opportunity seed...");

  // Optional:
  // Clear existing opportunity seed data before inserting again.
  await prisma.opportunity.deleteMany();

  const opportunities = [
    // =========================================================
    // 1. GATE 2027
    // ======================npm install @prisma/adapter-pg pg===================================
    {
      title: "GATE 2027",
      organization: "IIT Guwahati / GATE 2027",
      description:
        "Graduate Aptitude Test in Engineering (GATE) 2027 for students and graduates seeking opportunities in higher education, recruitment and related programs.",
      category: "ENTRANCE_EXAM",
      opportunityType: "Competitive Examination",

      educationLevels: [
        "COLLEGE",
        "GRADUATE",
      ],

      degrees: [
        "BTECH",
        "BE",
        "MTECH",
        "ME",
        "MSC",
        "OTHER",
      ],

      branches: [
        "CSE",
        "IT",
        "ECE",
        "EEE",
        "ME",
        "CIVIL",
        "CHEMICAL",
        "OTHER",
      ],

      states: [],

      eligibility: {
        level: "Undergraduate and postgraduate candidates",
        note:
          "Eligibility should be validated against the official GATE 2027 notification before applying.",
      },

      location: "India",

      // Keep dates null until confirmed from the official
      // GATE 2027 notification.
      applicationStart: null,
      applicationDeadline: null,
      examDate: null,
      resultDate: null,

      officialUrl: "https://gate2027.iitg.ac.in/",
      applicationUrl: "https://gate2027.iitg.ac.in/",

      fees: {
        status: "VERIFY_OFFICIAL_NOTIFICATION",
      },

      requiredDocuments: [
        "Government-issued identification",
        "Recent photograph",
        "Signature",
        "Academic details",
      ],

      sourceName: "GATE 2027 Official Website",
      sourceUrl: "https://gate2027.iitg.ac.in/",

      lastVerified: new Date("2026-09-10"),

      isActive: true,
    },

    // =========================================================
    // 2. NATIONAL SCHOLARSHIP PORTAL - AY 2026-27
    // =========================================================
    {
      title: "National Scholarship Portal - AY 2026-27",
      organization: "Government of India",
      description:
        "National Scholarship Portal for discovering and applying to eligible scholarship schemes for the 2026-27 academic year.",

      category: "SCHOLARSHIP",
      opportunityType: "Scholarship Portal",

      educationLevels: [
        "SCHOOL",
        "COLLEGE",
        "GRADUATE",
      ],

      degrees: [],

      branches: [],

      states: [
        "ALL_INDIA",
      ],

      eligibility: {
        note:
          "Eligibility varies by scholarship scheme.",
        requirement:
          "Students must satisfy the eligibility criteria of the selected scheme.",
        otrRequired: true,
      },

      location: "India",

      applicationStart: new Date("2026-06-01"),
      applicationDeadline: new Date("2026-10-31"),

      examDate: null,
      resultDate: null,

      officialUrl: "https://scholarships.gov.in/",
      applicationUrl: "https://scholarships.gov.in/",

      fees: {
        amount: 0,
        currency: "INR",
      },

      requiredDocuments: [
        "One Time Registration",
        "Academic documents",
        "Bank details",
        "Identity information",
        "Scheme-specific documents",
      ],

      sourceName: "National Scholarship Portal",
      sourceUrl: "https://scholarships.gov.in/",

      lastVerified: new Date("2026-09-10"),

      isActive: true,
    },

    // =========================================================
    // 3. PM YASASVI - TOP CLASS EDUCATION IN COLLEGE
    // =========================================================
    {
      title:
        "PM YASASVI Central Sector Scheme of Top Class Education in College",

      organization: "Ministry of Social Justice & Empowerment",

      description:
        "Scholarship scheme listed on the National Scholarship Portal for eligible OBC, EBC and DNT students pursuing higher education.",

      category: "SCHOLARSHIP",
      opportunityType: "Government Scholarship",

      educationLevels: [
        "COLLEGE",
      ],

      degrees: [
        "BTECH",
        "BE",
        "OTHER",
      ],

      branches: [],

      states: [
        "ALL_INDIA",
      ],

      eligibility: {
        categories: [
          "OBC",
          "EBC",
          "DNT",
        ],
        note:
          "Detailed eligibility must be checked against the official scheme guidelines.",
      },

      location: "India",

      applicationStart: new Date("2026-06-01"),
      applicationDeadline: new Date("2026-10-31"),

      examDate: null,
      resultDate: null,

      officialUrl: "https://scholarships.gov.in/",
      applicationUrl: "https://scholarships.gov.in/",

      fees: {
        amount: 0,
        currency: "INR",
      },

      requiredDocuments: [
        "One Time Registration",
        "Academic documents",
        "Category-related documents",
        "Income-related documents",
        "Bank details",
      ],

      sourceName: "National Scholarship Portal",
      sourceUrl: "https://scholarships.gov.in/All-Scholarships",

      lastVerified: new Date("2026-09-10"),

      isActive: true,
    },

    // =========================================================
    // 4. NATIONAL RENEWABLE ENERGY FELLOWSHIP SCHEME
    // =========================================================
    {
      title: "National Renewable Energy Fellowship Scheme",

      organization:
        "Ministry of New and Renewable Energy",

      description:
        "Merit-based fellowship opportunity listed on the National Scholarship Portal.",

      category: "RESEARCH",
      opportunityType: "Fellowship",

      educationLevels: [
        "COLLEGE",
        "GRADUATE",
      ],

      degrees: [
        "MSC",
        "MTECH",
        "OTHER",
      ],

      branches: [
        "ENERGY",
        "ENGINEERING",
        "SCIENCE",
        "OTHER",
      ],

      states: [
        "ALL_INDIA",
      ],

      eligibility: {
        note:
          "Eligibility must be checked against the official scheme criteria.",
      },

      location: "India",

      applicationStart: new Date("2026-06-01"),
      applicationDeadline: new Date("2026-10-31"),

      examDate: null,
      resultDate: null,

      officialUrl: "https://scholarships.gov.in/",
      applicationUrl: "https://scholarships.gov.in/",

      fees: {
        amount: 0,
        currency: "INR",
      },

      requiredDocuments: [
        "One Time Registration",
        "Academic records",
        "Scheme-specific documents",
      ],

      sourceName: "National Scholarship Portal",
      sourceUrl: "https://scholarships.gov.in/All-Scholarships",

      lastVerified: new Date("2026-09-10"),

      isActive: true,
    },

    // =========================================================
    // 5. ICAR NATIONAL TALENT SCHOLARSHIP
    // =========================================================
    {
      title: "ICAR National Talent Scholarship (NTS-UG)",

      organization:
        "Indian Council of Agricultural Research",

      description:
        "National Talent Scholarship opportunity listed on the National Scholarship Portal for eligible undergraduate students.",

      category: "SCHOLARSHIP",
      opportunityType: "Government Scholarship",

      educationLevels: [
        "COLLEGE",
      ],

      degrees: [
        "BSC",
        "BTECH",
        "OTHER",
      ],

      branches: [
        "AGRICULTURE",
        "SCIENCE",
        "OTHER",
      ],

      states: [
        "ALL_INDIA",
      ],

      eligibility: {
        level: "Undergraduate",
        note:
          "Detailed eligibility must be verified against the current ICAR scheme guidelines.",
      },

      location: "India",

      applicationStart: new Date("2026-06-01"),
      applicationDeadline: new Date("2026-10-31"),

      examDate: null,
      resultDate: null,

      officialUrl: "https://scholarships.gov.in/",
      applicationUrl: "https://scholarships.gov.in/",

      fees: {
        amount: 0,
        currency: "INR",
      },

      requiredDocuments: [
        "One Time Registration",
        "Academic documents",
        "Scheme-specific documents",
      ],

      sourceName: "National Scholarship Portal",
      sourceUrl: "https://scholarships.gov.in/All-Scholarships",

      lastVerified: new Date("2026-09-10"),

      isActive: true,
    },

    // =========================================================
    // 6. AWS CERTIFIED CLOUD PRACTITIONER
    // =========================================================
    {
      title: "AWS Certified Cloud Practitioner",

      organization: "Amazon Web Services",

      description:
        "Foundational AWS certification validating foundational knowledge of AWS Cloud.",

      category: "CERTIFICATION",
      opportunityType: "Professional Certification",

      educationLevels: [
        "COLLEGE",
        "GRADUATE",
      ],

      degrees: [],

      branches: [
        "CSE",
        "IT",
        "ECE",
        "EEE",
        "OTHER",
      ],

      states: [],

      eligibility: {
        level: "Foundational",
        examDurationMinutes: 90,
        questions: 65,
        examDelivery: [
          "Pearson VUE testing center",
          "Online proctored exam",
        ],
      },

      location: "Global",

      // No application deadline.
      // Candidates can schedule certification exams.
      applicationStart: null,
      applicationDeadline: null,
      examDate: null,
      resultDate: null,

      officialUrl:
        "https://aws.amazon.com/certification/certified-cloud-practitioner/",

      applicationUrl:
        "https://aws.amazon.com/certification/certified-cloud-practitioner/",

      fees: {
        amount: 100,
        currency: "USD",
      },

      requiredDocuments: [],

      sourceName: "AWS Certification",
      sourceUrl:
        "https://aws.amazon.com/certification/certified-cloud-practitioner/",

      lastVerified: new Date("2026-09-10"),

      isActive: true,
    },

    // =========================================================
    // 7. AWS CERTIFIED AI PRACTITIONER
    // =========================================================
    {
      title: "AWS Certified AI Practitioner",

      organization: "Amazon Web Services",

      description:
        "Foundational certification for validating knowledge of AI, machine learning and generative AI concepts on AWS.",

      category: "CERTIFICATION",
      opportunityType: "AI Certification",

      educationLevels: [
        "COLLEGE",
        "GRADUATE",
      ],

      degrees: [],

      branches: [
        "CSE",
        "IT",
        "ECE",
        "AI",
        "DATA_SCIENCE",
        "OTHER",
      ],

      states: [],

      eligibility: {
        level: "Foundational",
        examDurationMinutes: 90,
        questions: 65,
      },

      location: "Global",

      applicationStart: null,
      applicationDeadline: null,
      examDate: null,
      resultDate: null,

      officialUrl:
        "https://aws.amazon.com/certification/certified-ai-practitioner/",

      applicationUrl:
        "https://aws.amazon.com/certification/certified-ai-practitioner/",

      fees: {
        amount: 100,
        currency: "USD",
      },

      requiredDocuments: [],

      sourceName: "AWS Certification",
      sourceUrl:
        "https://aws.amazon.com/certification/certified-ai-practitioner/",

      lastVerified: new Date("2026-09-10"),

      isActive: true,
    },

    // =========================================================
    // 8. MICROSOFT IMAGINE CUP 2027
    // =========================================================
    {
      title: "Microsoft Imagine Cup 2027",

      organization: "Microsoft",

      description:
        "Student startup competition where student founders develop and present technology-driven solutions.",

      category: "COMPETITION",
      opportunityType: "Student Startup Competition",

      educationLevels: [
        "COLLEGE",
        "GRADUATE",
      ],

      degrees: [],

      branches: [
        "CSE",
        "IT",
        "ECE",
        "AI",
        "DATA_SCIENCE",
        "OTHER",
      ],

      states: [],

      eligibility: {
        type: "Student competition",
        note:
          "Check the official 2027 competition rules for the exact eligibility requirements.",
      },

      location: "Global",

      // Do NOT invent competition round deadlines.
      applicationStart: null,
      applicationDeadline: null,
      examDate: null,
      resultDate: null,

      officialUrl:
        "https://imaginecup.microsoft.com/en-us/category/34",

      applicationUrl:
        "https://imaginecup.microsoft.com/en-us/category/34",

      fees: {
        amount: 0,
        currency: "USD",
      },

      requiredDocuments: [
        "Student verification",
        "Project/startup information",
      ],

      sourceName: "Microsoft Imagine Cup",
      sourceUrl:
        "https://imaginecup.microsoft.com/en-us/category/34",

      lastVerified: new Date("2026-09-10"),

      isActive: true,
    },

    // =========================================================
    // 9. MICROSOFT STUDENT AMBASSADORS
    // =========================================================
    {
      title: "Microsoft Student Ambassadors",

      organization: "Microsoft",

      description:
        "Global student community focused on technology, learning, leadership and practical experiences.",

      category: "CAREER_PROGRAM",
      opportunityType: "Student Community Program",

      educationLevels: [
        "COLLEGE",
        "GRADUATE",
      ],

      degrees: [],

      branches: [],

      states: [],

      eligibility: {
        type: "Students",
        note:
          "Current application/eligibility requirements should be checked on the official program page.",
      },

      location: "Global",

      applicationStart: null,
      applicationDeadline: null,
      examDate: null,
      resultDate: null,

      officialUrl:
        "https://mvp.microsoft.com/studentambassadors",

      applicationUrl:
        "https://mvp.microsoft.com/studentambassadors",

      fees: {
        amount: 0,
        currency: "USD",
      },

      requiredDocuments: [],

      sourceName: "Microsoft Student Ambassadors",
      sourceUrl:
        "https://mvp.microsoft.com/studentambassadors",

      lastVerified: new Date("2026-09-10"),

      isActive: true,
    },
  ];

  for (const opportunity of opportunities) {
    await prisma.opportunity.create({
      data: opportunity,
    });
  }

  console.log(
    `✅ Successfully seeded ${opportunities.length} opportunities`
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });