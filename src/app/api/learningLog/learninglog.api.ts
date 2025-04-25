/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/lib/axiosClient";
import { PaymentLog, PaymentLogResponse } from "@/types/paymentLog";

const ENDPOINT = {
  VIEW_LOG: "/learning-log/view",
  VIEW_STATISTICS: "/statistics/view",
  VIEW_ACTIVITY_LOG: "/activity-log/user",
  TRACK_LOG: "/learning-log/track",
  PAYMENT_HISTORY: "/v1/payment/all",
};

export const getLearningLog = async ({
  token,
  date,
}: {
  token: string;
  date?: string;
}): Promise<LearningLog> => {
  console.log(
    `[${new Date().toISOString()}] Calling getLearningLog with date: ${date || "none"}`
  );
  try {
    const params = new URLSearchParams();

    if (date) params.append("date", date);

    const response = await axiosClient.get(
      `${ENDPOINT.VIEW_LOG}${params.toString() ? `?${params.toString()}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data as LearningLogResponse;

    if (responseData.data) {
      console.log(`[${new Date().toISOString()}] getLearningLog succeeded`);
      return responseData.data;
    }
    throw new Error(responseData.message || "No learning log data returned");
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] Error fetching learning log:`,
      error
    );
    throw error;
  }
};

export const getLearningStatistics = async ({
  token,
  studentId,
}: {
  token: string;
  studentId: number;
}): Promise<LearningStatistics> => {
  console.log(
    `[${new Date().toISOString()}] Calling getLearningStatistics for studentId: ${studentId}`
  );
  try {
    const params = new URLSearchParams();

    params.append("studentId", studentId.toString());

    const response = await axiosClient.get(
      `${ENDPOINT.VIEW_STATISTICS}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data as LearningStatisticsResponse;

    if (responseData.data) {
      console.log(
        `[${new Date().toISOString()}] getLearningStatistics succeeded`
      );
      return responseData.data;
    }
    throw new Error(
      responseData.message || "No learning statistics data returned"
    );
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] Error fetching learning statistics:`,
      error
    );
    throw error;
  }
};

export const getActivityLog = async ({
  token,
  userId,
  page = 0,
  size = 20,
}: {
  token: string;
  userId: number;
  page?: number;
  size?: number;
}): Promise<ActivityLog[]> => {
  console.log(
    `[${new Date().toISOString()}] Calling getActivityLog for userId: ${userId}, page: ${page}, size: ${size}`
  );
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await axiosClient.get(
      `${ENDPOINT.VIEW_ACTIVITY_LOG}/${userId}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data as ActivityLogResponse;

    if (responseData.data) {
      console.log(`[${new Date().toISOString()}] getActivityLog succeeded`);
      return responseData.data;
    }
    throw new Error(responseData.message || "No activity log data returned");
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] Error fetching activity log:`,
      error
    );
    throw error;
  }
};

export const getPaymentHistory = async ({
  token,
  studentId,
  transactionStatus = "COMPLETED",
}: {
  token: string;
  studentId: number;
  transactionStatus?: string;
}): Promise<PaymentLog[]> => {
  console.log(
    `[${new Date().toISOString()}] Calling getPaymentHistory for studentId: ${studentId}, transactionStatus: ${transactionStatus}`
  );
  try {
    const params = new URLSearchParams();
    params.append("studentId", studentId.toString());
    if (transactionStatus) params.append("transactionStatus", transactionStatus);

    const response = await axiosClient.get(
      `${ENDPOINT.PAYMENT_HISTORY}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data as PaymentLogResponse;

    if (responseData.data) {
      // Check for duplicate transactionIds
      const transactionIdCounts = responseData.data.reduce((acc, log) => {
        acc[log.transactionId] = (acc[log.transactionId] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      const duplicates = Object.entries(transactionIdCounts)
        .filter(([_, count]) => count > 1)
        .map(([transactionId]) => transactionId);
      if (duplicates.length > 0) {
        console.warn(
          `Duplicate transactionIds detected: ${duplicates.join(", ")}`,
          responseData.data
        );
      }

      console.log(`[${new Date().toISOString()}] getPaymentHistory succeeded`);
      return responseData.data;
    }
    throw new Error(responseData.message || "No payment history data returned");
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] Error fetching payment history:`,
      error
    );
    throw error;
  }
};