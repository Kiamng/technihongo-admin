export type ViolationStatus = "pending" | "resolved" | "dismissed";

export interface StudentViolation {
  violation_id: number;
  student_set_id: string | null;
  rating_id: string | null;
  description: string;
  action_taken: string;
  reported_by: number;
  handled_by: number;
  status: ViolationStatus;
  created_at: string; // ISO date string
  resolved_at?: string | null; // Optional field
}

export const studentViolations: StudentViolation[] = [
  {
    violation_id: 1,
    student_set_id: "101",
    rating_id: null,
    description: "Cheating during an online test",
    action_taken: "Issued a warning",
    reported_by: 10,
    handled_by: 5,
    status: "pending",
    created_at: "2025-02-27T12:00:00.000Z",
    resolved_at: null,
  },
  {
    violation_id: 2,
    student_set_id: null,
    rating_id: null,
    description: "Plagiarism detected in an assignment",
    action_taken: "Assignment was invalidated",
    reported_by: 12,
    handled_by: 7,
    status: "pending",
    created_at: "2025-02-26T10:30:00.000Z",
    resolved_at: null,
  },
  {
    violation_id: 3,
    student_set_id: "103",
    rating_id: null,
    description: "Inappropriate behavior in discussion forum",
    action_taken: "Temporary suspension",
    reported_by: 14,
    handled_by: 9,
    status: "resolved",
    created_at: "2025-02-25T08:15:00.000Z",
    resolved_at: "2025-02-26T14:00:00.000Z",
  },
  {
    violation_id: 4,
    student_set_id: null,
    rating_id: null,
    description: "Using offensive language",
    action_taken: "Given a formal warning",
    reported_by: 15,
    handled_by: 10,
    status: "dismissed",
    created_at: "2025-02-24T09:00:00.000Z",
    resolved_at: "2025-02-25T11:30:00.000Z",
  },
  {
    violation_id: 5,
    student_set_id: "105",
    rating_id: null,
    description: "Attempting to bribe an instructor",
    action_taken: "Reported to administration",
    reported_by: 16,
    handled_by: 11,
    status: "pending",
    created_at: "2025-02-23T07:45:00.000Z",
    resolved_at: null,
  },
  {
    violation_id: 6,
    student_set_id: null,
    rating_id: "105",
    description: "Hacking into exam system",
    action_taken: "Expelled",
    reported_by: 18,
    handled_by: 12,
    status: "resolved",
    created_at: "2025-02-22T13:20:00.000Z",
    resolved_at: "2025-02-23T16:45:00.000Z",
  },
  {
    violation_id: 7,
    student_set_id: "107",
    rating_id: null,
    description: "Sharing exam questions publicly",
    action_taken: "Suspended for 1 week",
    reported_by: 19,
    handled_by: 13,
    status: "resolved",
    created_at: "2025-02-21T11:10:00.000Z",
    resolved_at: "2025-02-22T15:20:00.000Z",
  },
  {
    violation_id: 8,
    student_set_id: null,
    rating_id: "106",
    description: "Abusive behavior towards instructor",
    action_taken: "Expelled",
    reported_by: 20,
    handled_by: 14,
    status: "resolved",
    created_at: "2025-02-20T14:25:00.000Z",
    resolved_at: "2025-02-21T18:40:00.000Z",
  },
  {
    violation_id: 9,
    student_set_id: "109",
    rating_id: null,
    description: "Multiple accounts detected",
    action_taken: "Accounts merged and warned",
    reported_by: 21,
    handled_by: 15,
    status: "dismissed",
    created_at: "2025-02-19T09:00:00.000Z",
    resolved_at: "2025-02-20T10:45:00.000Z",
  },
  {
    violation_id: 10,
    student_set_id: null,
    rating_id: "107",
    description: "Unauthorized access to course materials",
    action_taken: "Revoked access and issued warning",
    reported_by: 22,
    handled_by: 16,
    status: "pending",
    created_at: "2025-02-18T16:30:00.000Z",
    resolved_at: null,
  },
];

export default studentViolations;
