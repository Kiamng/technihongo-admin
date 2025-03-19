import axiosClient from "@/lib/axiosClient";
import { addDomainSchema } from "@/schema/domain";
import { DomainList } from "@/types/domain";
import { z } from "zod";

const ENDPOINT = {
    GETALLDOMAIN: "domain/all",
    GETDOMAIN: "",
    ADDDOMAIN: "domain/create",
    UPDATEDOMAIN: "domain/update/{domainId}",
    DELETEDOMAIN: "domain/delete/{domainId}",
    GET_CHILDREN_DOMAIN : '/domain/childrenDomain',
};



export const getAllDomain = async ({
    pageNo,
    pageSize
  }: {
    pageNo? : number,
    pageSize? : number
  }): Promise<DomainList> => {
    const params = new URLSearchParams();
      if (pageNo) params.append("pageNo", pageNo.toString());
      if (pageSize) params.append("pageSize", pageSize.toString());
      try {
          const response = await axiosClient.get(`${ENDPOINT.GETALLDOMAIN}?${params.toString()}`);
          return response.data.data as DomainList;
      } catch (error) {
          console.error("Error fetching subscriptions:", error);
          throw error;
      }
};


export const addDomain = async (values: z.infer<typeof addDomainSchema>) => {
    try {
        addDomainSchema.parse(values);
        // Gửi request lên backend
        const response = await axiosClient.post(ENDPOINT.ADDDOMAIN, {
            name: values.name,
            tag: values.tag,
            parentDomainId: Number(values.parentDomainId) ,
            description: values.description,
            isActive: false,
        });

        return response.data.data;
    } catch (error) {
        console.error("Error adding Domain:", error);
        throw new Error("An error occurred while adding the Domain!!.");
    }
};

export const updateDomain = async (
  domainId: number,
  values: {
    tag: string;
    name: string;
    description: string;
    parentDomainId: number;
    isActive: boolean;
  }
) => {
  try {
    const response = await axiosClient.patch(
      ENDPOINT.UPDATEDOMAIN.replace("{domainId}", String(domainId)),
      {
        tag: values.tag,
        name: values.name,
        description: values.description,
        parentDomainId: values.parentDomainId, 
        isActive: values.isActive,
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error updating domain:", error);
    throw new Error("An error occurred while updating the domain.");
  }
};
export const deleteDomain = async (domainId: number) => {
  try {
    const response = await axiosClient.delete(
      `${ENDPOINT.DELETEDOMAIN.replace("{domainId}", String(domainId))}`
    );
    
    return response.data;
  } catch (error) {
    console.error("Error deleting Domain:", error);
    throw new Error("An error occurred while deleting the Domain.");
  }
};

export const getChildrenDomain = async (
  {
    pageNo,
    pageSize,
    sortBy,
    sortDir
  }: {
    pageNo? : number,
    pageSize? : number,
    sortBy? : string,
    sortDir?: string
  }
) : Promise<DomainList> => {
   const params = new URLSearchParams();
      if (pageNo) params.append("pageNo", pageNo.toString());
      if (pageSize) params.append("pageSize", pageSize.toString());
      if (sortBy) params.append("sortBy", sortBy);
      if (sortDir) params.append("sortDir", sortDir);
  const response = await axiosClient.get(ENDPOINT.GET_CHILDREN_DOMAIN)
  return response.data.data
}