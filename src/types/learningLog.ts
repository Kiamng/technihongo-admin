/* eslint-disable @typescript-eslint/no-unused-vars */
interface Student {
  studentId: number;
  bio: string | null;
  dailyGoal: number;
  occupation: string;
  reminderEnabled: boolean;
  reminderTime: string | null;
  difficultyLevel: string | null;
  updatedAt: string;
}

interface LearningLog {
  logId: number;
  student: Student;
  logDate: string;
  studyTime: number;
  completedLessons: number;
  completedQuizzes: number;
  completedResources: number;
  completedFlashcardSets: number;
  dailyGoalAchieved: boolean;
  streak: number;
  createdAt: string;
}

interface LearningLogResponse {
  success: boolean;
  message: string;
  data: LearningLog;
}

interface ActivityLog {
  logId: number;
  activityType: "LOGIN" | "COMPLETE";
  contentType: string | null;
  contentId: number | null;
  description: string;
  createdAt: string;
}

interface ActivityLogResponse {
  success: boolean;
  message: string;
  data: ActivityLog[];
}

interface LearningStatistics {
  learningStatId: number;
  student: Student;
  totalStudyTime: number;
  totalCompletedCourses: number;
  totalCompletedLessons: number;
  totalCompletedQuizzes: number;
  activeDaysCount: number;
  maxDaysStreak: number;
  totalAchievementsUnlocked: number;
  lastStudyDate: string;
  updatedAt: string;
}

interface LearningStatisticsResponse {
  success: boolean;
  message: string;
  data: LearningStatistics;
}
