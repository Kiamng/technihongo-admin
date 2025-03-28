/* eslint-disable @typescript-eslint/no-explicit-any */
// Giả sử bạn đã có các type này
export type User = {
    userId: number;
    userName: string;
    email: string;
    password: string;
    dob: string | null;
    uid: string | null;
    createdAt: string;
    lastLogin: string;
    profileImg: string | null;
    student: any | null;
    active: boolean;
    verified: boolean;
  };
  
  export type Domain = {
    domainId: number;
    tag: string;
    name: string;
    description: string;
    createdAt: string;
  };
  
  export type LearningPath = {
    pathId: number;
    title: string;
    description: string;
    domain: Domain;
    creator: User;
    totalCourses: number;
    createdAt: string;
    public: boolean;
  };
  
  // Interface cho DifficultyLevel
  export type DifficultyLevel = {
    levelId: number;
    tag: string;
    name: string;
    description: string;
    createdAt: string; // Thời gian tạo difficulty level
  };
  
  // Interface cho Course
  export type Course = {
    courseId: number;
    title: string;
    description: string;
    creator: User; // Sử dụng type User đã có
    domain: Domain; // Sử dụng type Domain đã có
    difficultyLevel: DifficultyLevel; // Mức độ khó
    attachmentUrl: string; // URL tài liệu đính kèm
    thumbnailUrl: string; // URL ảnh thumbnail
    estimatedDuration: string; // Thời gian dự kiến hoàn thành
    enrollmentCount: number; // Số lượng người đăng ký
    publicStatus: boolean; // Trạng thái công khai
    createdAt: string; // Thời gian tạo khóa học
    updateAt: string | null; // Thời gian cập nhật, có thể null
    premium: boolean; // Khóa học có phải premium không
  };
  
  // Interface cho PathCourse
  export type PathCourse = {
    pathCourseId: number;
    learningPath: LearningPath; // Sử dụng type LearningPath đã có
    course: Course; // Thông tin khóa học
    courseOrder: number; // Thứ tự khóa học trong lộ trình
    createdAt: string; // Thời gian thêm khóa học vào lộ trình
  };
  
  // Interface cho response khi lấy danh sách PathCourse
  export type PathCourseListResponse = {
    content: PathCourse[]; // Danh sách PathCourse
    pageNo: number; // Số trang hiện tại
    pageSize: number; // Kích thước trang
    totalElements: number; // Tổng số phần tử
    totalPages: number; // Tổng số trang
    last: boolean; // Có phải trang cuối không
  };