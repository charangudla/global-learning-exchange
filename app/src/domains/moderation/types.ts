export type ModerationTargetType =
  | "user"
  | "speaker"
  | "request"
  | "booking"
  | "session"
  | "event"
  | "review"
  | "note"
  | "recording"
  | "content";

export type ModerationActionType =
  | "block"
  | "unblock"
  | "suspend"
  | "restore"
  | "hide"
  | "cancel"
  | "dispute";
