import { User } from "./user";

export type Meeting = {
  meetingId: number;
  title: string;
  description: string;
  voiceName: string;
  scriptsCount: number;
  creatorId: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MeetingList = {
    content : Meeting[],
    pageNo : number,
    pageSize : number,
    totalElements : number,
    totalPages : number,
    last: boolean
}

export type CreatMeetingResponse = {
  success : boolean,
  message : string,
  data : Meeting
}

export type Script = {
  scriptId: number;
  meeting : Meeting,
  question: string;
  answer: string;
  scriptOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ScriptList = {
  content : Script[],
  pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
    last: boolean
}