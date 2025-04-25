export interface PaymentLog {
    transactionId: number;
    subscriptionPlanName: string;
    paymentMethod: string;
    transactionAmount: number;
    currency: string;
    transactionStatus: string;
    paymentDate: string;
    createdAt: string;
  }
  
  export interface PaymentLogResponse {
    success: boolean;
    message: string;
    data: PaymentLog[];
  }