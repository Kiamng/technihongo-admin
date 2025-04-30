import axiosClient from "@/lib/axiosClient";
import { addDomainSchema } from "@/schema/domain";
import { DomainList } from "@/types/domain";
import { z } from "zod";

const ENDPOINT = {
    GETALLDOMAIN: "domain/all",
    GETDOMAIN: "/domain",
    ADDDOMAIN: "domain/create",
    UPDATEDOMAIN: "domain/update",
    DELETEDOMAIN: "domain/delete",
    GET_CHILDREN_DOMAIN : '/domain/childrenDomain',
    GET_PARENT_DOMAIN: '/domain/parentDomain'
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


export const addDomain = async (token :string, values: z.infer<typeof addDomainSchema>) => {
    try {
        addDomainSchema.parse(values);
        // Gửi request lên backend
        const response = await axiosClient.post(ENDPOINT.ADDDOMAIN, {
            name: values.name,
            tag: values.tag,
            parentDomainId: values.parentDomainId,
            description: values.description,
            isActive: false,
        },
      {
              headers: {
              Authorization: `Bearer ${token}`
              }
      });

        return response.data.data;
    } catch (error) {
        console.error("Error adding Domain:", error);
        throw new Error("An error occurred while adding the Domain!!.");
    }
};

export const updateDomain = async (
  token :string,
  domainId: number,
  values: z.infer<typeof addDomainSchema>
) => {
  try {
    const response = await axiosClient.patch(
      `${ENDPOINT.UPDATEDOMAIN}/${domainId}`,
      {
        tag: values.tag,
        name: values.name,
        description: values.description,
        parentDomainId: values.parentDomainId, 
        isActive: values.isActive,
      },
      {
              headers: {
              Authorization: `Bearer ${token}`
              }
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error updating domain:", error);
    throw new Error("An error occurred while updating the domain.");
  }
};
export const deleteDomain = async (token : string ,domainId: number) => {
    const response = await axiosClient.delete(
      `${ENDPOINT.DELETEDOMAIN}/${domainId}`,
      {
              headers: {
              Authorization: `Bearer ${token}`
              }
          }
    );
    
    return response.data;
};

export const getChildrenDomain = async (
  {
    token,
    pageNo,
    pageSize,
    sortBy,
    sortDir
  }: {
    token : string
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
  const response = await axiosClient.get(`${ENDPOINT.GET_CHILDREN_DOMAIN}?${params.toString()}`,
    {
              headers: {
              Authorization: `Bearer ${token}`
              }
          }
)
  return response.data.data
}

export const getParentDomains = async (
  {
    token,
    pageNo,
    pageSize,
    sortBy,
    sortDir
  } : {
    token : string
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
  const response = await axiosClient.get(`${ENDPOINT.GET_PARENT_DOMAIN}?${params.toString()}`,
    {
              headers: {
              Authorization: `Bearer ${token}`
              }
          }
)
  return response.data.data
}

export const getChildrenDomainsByParentId = async (
  {
    token,
    parentId,
    pageNo,
    pageSize,
    sortBy,
    sortDir
  }: {
    token: string
    parentId: number
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
  const response = await axiosClient.get(`${ENDPOINT.GETDOMAIN}/${parentId}/getChildrenTag`,
    {
      headers: {
              Authorization: `Bearer ${token}`
              }
    }
  )
  return response.data.data
}