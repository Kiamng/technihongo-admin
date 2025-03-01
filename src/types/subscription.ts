export type SubscriptionPlan = {
    id: string;
    name: string;
    price: number;
    durationDays: number;
    isActive: boolean;
  };
  
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "1",
      name: "Basic Plan",
      price: 9.99,
      durationDays: 30,
      isActive: true,
    },
    {
      id: "2",
      name: "Standard Plan",
      price: 19.99,
      durationDays: 30,
      isActive: true,
    },
    {
      id: "3",
      name: "Premium Plan",
      price: 29.99,
      durationDays: 30,
      isActive: true,
    },
    {
      id: "4",
      name: "Annual Basic Plan",
      price: 99.99,
      durationDays: 365,
      isActive: false,
    },
    {
      id: "5",
      name: "Annual Premium Plan",
      price: 299.99,
      durationDays: 365,
      isActive: false,
    },
    {
      id: "6",
      name: "Enterprise Plan",
      price: 499.99,
      durationDays: 365,
      isActive: false,
    },
  ];
  
  export default subscriptionPlans;
  