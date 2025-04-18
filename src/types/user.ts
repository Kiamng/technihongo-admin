import { DifficultyLevel } from "./difficulty-level";

export type User = {
  userId: number;
  userName: string;
  email: string;
  password: string;
  dob: Date | null;  // Ngày sinh có thể là chuỗi hoặc null
  uid: string | null;  // UID có thể là chuỗi hoặc null
  createdAt: Date;   // Ngày tạo, kiểu string (có thể là Date nếu muốn)
  lastLogin: Date;   // Ngày đăng nhập cuối cùng, kiểu string (có thể là Date nếu muốn)
  profileImg: string | null; // Ảnh đại diện có thể là chuỗi hoặc null
  student: Student | null; // Có thể là chuỗi hoặc null, nếu có thông tin sinh viên
  active: boolean;  // Trạng thái hoạt động (true/false)
};

export type Student = {
  studentId: number;
  bio: string;
  dailyGoal: number;
  occupation: string;
  reminderEnabled: boolean;
  reminderTime: string;
  difficultyLevel: DifficultyLevel;
  updatedAt: string;
};

export type UserList = {
  content : User[],
  pageNo: number,
  pageSize: number,
  totalElements: number,
  totalPages: number,
  last: boolean
}