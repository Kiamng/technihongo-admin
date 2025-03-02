export type SubscriptionPlan = {
  subPlanId: number;
  name: string;
  price: number; 
  benefits: string;
  durationDays: number; 
  createdAt: Date; // Dữ liệu từ API có thể là chuỗi, cần convert
  active: boolean;
};
