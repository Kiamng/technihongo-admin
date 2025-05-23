import axiosClient from "@/lib/axiosClient";
import { addSubscriptionPlanSchema } from "@/schema/subscriptionplan";
import { SubscriptionPlan } from "@/types/subscription";
import { z } from "zod";

const ENDPOINT = {
    GETALLSUBCRIPTION: "subscription/all",
    GETSUBCRIPTION: "",
    ADDSUBSCRIPTIONPLAN: "subscription/create",
    UPDATESUBSCRIPTIONPLAN: "subscription/update/{subPlanId}",
    DELETESUBSCRIPTIONPLAN: "subscription/delete/{subPlanId}",
    GET_ADMIN_OVERVIEW: "dashboard/admin/overview",
    GET_REVENUE_BY_PLAN: "/v1/subscription/revenue-by-plan",
    GET_REVENUE_BY_PERIOD: "/v1/subscription/revenue-by-period",
    GET_MOST_POPULAR_PLAN: "/v1/subscription/most-popular-plan",
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
export interface RevenueByPeriod {
  period: string;
  totalRevenue: number;
}
export interface MostPopularPlan {
  subPlanId: number;
  planName: string;
  purchaseCount: number;
  totalRevenue: number;
}

export const getAllSubscription = async (token : string): Promise<SubscriptionPlan[]> => {
  try {
      const response = await axiosClient.get(ENDPOINT.GETALLSUBCRIPTION,
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
      );
      return response.data.data as SubscriptionPlan[];
  } catch (error) {
      console.error("Error fetching subscriptions:", error);
      throw error;
  }
};


export const addSubscriptionPlan = async (token : string, values: z.infer<typeof addSubscriptionPlanSchema>) => {
    try {
        addSubscriptionPlanSchema.parse(values);
        const response = await axiosClient.post(ENDPOINT.ADDSUBSCRIPTIONPLAN, {
            name: values.name,
            price: Number(values.price) ,
            benefits: values.benefits,
            durationDays: Number(values.durationDays),
            isActive: false,
        },
        {
              headers: {
              Authorization: `Bearer ${token}`
              }
          }
      );

        return response.data.data;
    } catch (error) {
        console.error("Error adding subscription plan:", error);
        throw new Error("An error occurred while adding the subscription plan.");
    }
};

export const updateSubscriptionPlan = async (token : string, subPlanId: number, values: { name: string; price: number; benefits: string; durationDays: number; active: boolean }) => {
  try {
    const response = await axiosClient.patch(`${ENDPOINT.UPDATESUBSCRIPTIONPLAN.replace("{subPlanId}", String(subPlanId))}`, {
      name: values.name,
      price: values.price,
      benefits: values.benefits,
      durationDays: values.durationDays,
      active: values.active, 
    },
    {
              headers: {
              Authorization: `Bearer ${token}`
              }
          }
  );

    return response.data.data;
  } catch (error) {
    console.error("Error updating subscription plan", error);
    throw error; 
  }
};

export const deleteSubscriptionPlan = async (token : string, subPlanId: number) => {
  try {
    const response = await axiosClient.delete(
      `${ENDPOINT.DELETESUBSCRIPTIONPLAN.replace("{subPlanId}", String(subPlanId))}`,
      {
              headers: {
              Authorization: `Bearer ${token}`
              }
          }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    throw new Error("An error occurred while deleting the subscription plan.");
  }
};
export const getAdminOverview = async (token: string): Promise<AdminOverview> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_ADMIN_OVERVIEW, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data as AdminOverview;
  } catch (error) {
    console.error("Error fetching admin overview:", error);
    throw new Error("Failed to fetch admin overview data.");
  }
};
export const getRevenueByPlan = async (token: string): Promise<RevenueByPlan[]> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_REVENUE_BY_PLAN, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data as RevenueByPlan[];
  } catch (error) {
    console.error("Error fetching revenue by plan:", error);
    throw new Error("Failed to fetch revenue by plan data.");
  }
};

export const getRevenueByPeriod = async (token: string, periodType: string): Promise<RevenueByPeriod[]> => {
  try {
    // Sửa từ ?period=${periodType} thành ?periodType=${periodType}
    const response = await axiosClient.get(`${ENDPOINT.GET_REVENUE_BY_PERIOD}?periodType=${periodType}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data as RevenueByPeriod[];
  } catch (error) {
    console.error("Error fetching revenue by period:", error);
    throw new Error("Failed to fetch revenue by period data.");
  }
};

export const getMostPopularPlan = async (token: string): Promise<MostPopularPlan> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_MOST_POPULAR_PLAN, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data as MostPopularPlan;
  } catch (error) {
    console.error("Error fetching most popular plan:", error);
    throw new Error("Failed to fetch most popular plan data.");
  }
};