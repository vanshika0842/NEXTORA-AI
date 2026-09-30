# Nextora Opportunity Finder — O1 Requirements

## 1. Purpose

The Opportunity Finder allows students to discover career-related opportunities that are relevant to their education and profile.

## 2. Opportunity Categories

Nextora will initially support:

* Scholarships
* Government Exams
* Internships
* Certifications
* Research Opportunities
* Competitions
* Entrance / Competitive Exams
* International Opportunities
* Career Programs

## 3. Opportunity Information

Every opportunity should support:

### Basic Information

* Title
* Organization
* Category
* Opportunity Type
* Description

### Eligibility

* Education Level
* Degree
* Branch
* State
* Location
* Age requirements
* Academic requirements
* Other eligibility rules

### Important Dates

* Application Start Date
* Application Deadline
* Exam Date
* Result Date

### Application

* Official Website
* Application URL
* Fees
* Required Documents

### Source Tracking

* Source Name
* Source URL
* Last Verified Date

### System Information

* Active / Inactive
* Created Date
* Updated Date

## 4. Opportunity Finder Features

### Search

Students can search opportunities using keywords.

Examples:

* internships for CSE students
* government exams
* scholarships for BTech
* AI certifications

### Filters

Students can filter by:

* Category
* Education Level
* Degree
* Branch
* State
* Location
* Eligibility
* Application Status
* Deadline
* Opportunity Type

### Deadline Filters

* All
* This Week
* This Month
* Next 3 Months

## 5. Student Matching

Nextora will compare:

Student Profile
↓
Opportunity Eligibility
↓
Eligibility Engine
↓
Match Result

Possible results:

* Eligible
* Not Eligible
* Almost Eligible
* Unknown

Later, Nextora will generate a Match Score.

Example:

Match Score: 92%

Reasons:

* BTech student
* Computer Science branch
* Graduation year matches
* State requirement matches

## 6. Main Routes

Opportunity Finder:

/opportunities

Opportunity Details:

/opportunities/:id

## 7. Backend Architecture

Sources
↓
Data Collection
↓
Normalization
↓
Opportunity Database
↓
Eligibility Engine
↓
Student Profile
↓
Matching
↓
Opportunity Finder

## 8. Development Order

O1 — Requirements and Architecture

O2 — Prisma Database Schema

O3 — Opportunity Backend API

O4 — Seed Realistic Opportunity Data

O5 — Opportunity Finder React UI

O6 — Search

O7 — Filters

O8 — Opportunity Details

O9 — Save / Bookmark

O10 — Dashboard Integration

## 9. Future Intelligence Layer

The initial system will use database-stored opportunities.

Later:

50+ Sources
↓
Web Crawlers / APIs
↓
Data Extraction
↓
Normalization
↓
Database
↓
Eligibility Rule Engine
↓
AI Matching
↓
Personalized Recommendations
↓
Notifications
