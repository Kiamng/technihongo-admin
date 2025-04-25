export type SubscriptionPlan = {
  subPlanId: number;
  name: string;
  price: number; 
  benefits: string;
  durationDays: number; 
  createdAt: Date; // Dữ liệu từ API có thể là chuỗi, cần convert
  active: boolean;
};


export interface AdminOverview {
  totalStudents: number;
  totalActiveCourses: number;
  totalSubscriptionsSold: number;
  yearlyRevenue: YearlyRevenue[];
}
export interface YearlyRevenue {
  month: string;
  revenue: number;
}
export interface RevenueByPlan {
  planName: string;
  purchaseCount: number;
  totalRevenue: number;
}
