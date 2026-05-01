export type BookingStatus =
  | "draft"
  | "requested"
  | "pending_speaker_response"
  | "confirmed"
  | "cancelled"
  | "cancelled_by_admin"
  | "completed"
  | "no_show"
  | "disputed"
  | "blocked";
