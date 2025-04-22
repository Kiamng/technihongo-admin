/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface DifficultyLevel {
  levelId: number;
  tag: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Student {
  studentId: number;
  bio: string | null;
  dailyGoal: number;
  occupation: string;
  reminderEnabled: boolean;
  reminderTime: string | null;
  difficultyLevel: DifficultyLevel | null;
  updatedAt: string;
}

export interface User {
  userId: number;
  userName: string;
  email: string;
  password: string;
  dob: string | null;
  uid: string | null;
  createdAt: string;
  lastLogin: string;
  profileImg: string | null;
  student: Student | null;
  active: boolean;
  verified: boolean;
}

export interface Domain {
  domainId: number;
  tag: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Course {
  courseId: number;
  title: string;
  description: string;
  creator: User;
  domain: Domain;
  difficultyLevel: DifficultyLevel;
  attachmentUrl: string;
  thumbnailUrl: string;
  estimatedDuration: string;
  enrollmentCount: number;
  publicStatus: boolean;
  createdAt: string;
  updateAt: string | null;
  premium: boolean;
}

export interface StudentCourseRating {
  ratingId: number;
  student: Student;
  course: Course;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface StudentFlashcardSet {
  studentSetId: number;
  title: string;
  description: string;
  creator: Student;
  learningResource: any | null;
  totalCards: number;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
  public: boolean;
  deleted: boolean;
  violated: boolean;
}

export interface StudentViolation {
  violationId: number;
  studentFlashcardSet: StudentFlashcardSet | null;
  studentCourseRating: StudentCourseRating | null;
  description: string;
  actionTaken: string | null;
  reportedBy: User;
  handledBy: User | null;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  resolvedAt: string | null;
}

export interface ViolationList {
  content: StudentViolation[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const studentViolations: StudentViolation[] = [];

export default studentViolations;