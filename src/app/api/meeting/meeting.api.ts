import axiosClient from "@/lib/axiosClient";
import { CreatMeetingResponse, Meeting, MeetingList, ScriptList } from "@/types/meeting";

const ENDPOINT = {
    GET_ALL : '/meeting/all',
    CREATE: '/meeting/create',
    GET_BY_ID : '/meeting',
    GET_SCRIPTS_BY_MEETING_ID : '/script/meeting',
    DELETE_SCRIPT : '/script/delete',
    UPDATE_MEETING :'/meeting/update',
    CREATE_SCRIPT : '/script/create',
    UPDATE_SCRIPT : '/script/update',
    UPDATE_SCRIPT_ORDER :'/script/update-order'
}

export const getAllMeeting = async ({
  token,
  pageNo,
  pageSize,
  sortBy,
  sortDir,
}: {
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}):Promise<MeetingList> => {
    const params = new URLSearchParams();
  if (pageNo) params.append("pageNo", pageNo.toString());
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);
  const response = await axiosClient.get(`${ENDPOINT.GET_ALL}?${params.toString()}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data.data;
}

export const createMeeting = async (token: string, title : string, description : string):Promise<CreatMeetingResponse> => {
  const response = await axiosClient.post(ENDPOINT.CREATE,
    {
      title : title,
      description : description
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const getMeetingById = async (token : string, meetingId: number):Promise<Meeting> => {
  const response = await axiosClient.get(`${ENDPOINT.GET_BY_ID}/${meetingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data.data
}

export const getScriptsByMeetingId = async (
  {
    meetingId,
  token,
  pageNo,
  pageSize,
  sortBy,
  sortDir,
}: {
  meetingId : string;
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}
) :Promise<ScriptList>=> {
  const params = new URLSearchParams();
    if (pageNo) params.append("pageNo", pageNo.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (sortBy) params.append("sortBy", sortBy);
    if (sortDir) params.append("sortDir", sortDir);
    const response = await axiosClient.get(`${ENDPOINT.GET_SCRIPTS_BY_MEETING_ID}/${meetingId}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data.data
}

export const deleteScript = async (token: string, scriptId : number) => {
  const response = await axiosClient.delete(`${ENDPOINT.DELETE_SCRIPT}/${scriptId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const updateMeeting = async (token: string, meeting : number, title : string, description : string, isActive : boolean, voiceName : string) => {
  const response = await axiosClient.patch(`${ENDPOINT.UPDATE_MEETING}/${meeting}`,
    {
      title : title,
      description : description,
      isActive : isActive,
      voiceName : voiceName
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const createScript = async (token: string, meetingId : number, question : string, questionExplain: string, answer : string, answerExplain: string) => {
  const response = await axiosClient.post(`${ENDPOINT.CREATE_SCRIPT}`,
    {
      meetingId : meetingId,
      question : question,
      questionExplain: questionExplain,
      answer : answer,
      answerExplain: answerExplain
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const updateScript = async (token: string, scripId : number, question : string, questionExplain: string,  answer : string, answerExplain: string) => {
  const response = await axiosClient.patch(`${ENDPOINT.UPDATE_SCRIPT}/${scripId}`,
    {
      question : question,
      questionExplain: questionExplain,
      answer : answer,
      answerExplain: answerExplain
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const updateScriptOrder = async (
  token: string,
  meetingId: number,
  newOrder: number[],
) => {
  const reponse = await axiosClient.patch(
    `${ENDPOINT.UPDATE_SCRIPT_ORDER}/${meetingId}`,
    {
      newScriptOrder: newOrder,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return reponse.data;
};
