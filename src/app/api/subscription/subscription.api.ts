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
};



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
