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



export const getAllSubscription = async (): Promise<SubscriptionPlan[]> => {
  console.log("Fetching from:", axiosClient.defaults.baseURL + ENDPOINT.GETALLSUBCRIPTION);
  
  try {
      const response = await axiosClient.get(ENDPOINT.GETALLSUBCRIPTION);
      console.log("Fetched Data:", response.data); // Kiểm tra dữ liệu nhận được
      return response.data.data as SubscriptionPlan[];
  } catch (error) {
      console.error("Error fetching subscriptions:", error);
      throw error;
  }
};


export const addSubscriptionPlan = async (values: z.infer<typeof addSubscriptionPlanSchema>) => {
    try {
        addSubscriptionPlanSchema.parse(values);
        // Gửi request lên backend
        const response = await axiosClient.post(ENDPOINT.ADDSUBSCRIPTIONPLAN, {
            name: values.name,
            price: Number(values.price) ,
            benefits: values.benefits,
            durationDays: Number(values.durationDays),
            isActive: false,
        });

        return response.data.data;
    } catch (error) {
        console.error("Error adding subscription plan:", error);
        throw new Error("An error occurred while adding the subscription plan.");
    }
};

export const updateSubscriptionPlan = async (subPlanId: number, values: { name: string; price: number; benefits: string; durationDays: number; active: boolean }) => {
  try {
    const response = await axiosClient.patch(`${ENDPOINT.UPDATESUBSCRIPTIONPLAN.replace("{subPlanId}", String(subPlanId))}`, {
      name: values.name,
      price: values.price,
      benefits: values.benefits,
      durationDays: values.durationDays,
      active: values.active, 
    });

    return response.data.data;
  } catch (error) {
    console.error("Error updating subscription plan", error);
    throw error; 
  }
};

export const deleteSubscriptionPlan = async (subPlanId: number) => {
  try {
    const response = await axiosClient.delete(
      `${ENDPOINT.DELETESUBSCRIPTIONPLAN.replace("{subPlanId}", String(subPlanId))}`
    );
    
    return response.data;
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    throw new Error("An error occurred while deleting the subscription plan.");
  }
};
