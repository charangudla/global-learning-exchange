import { asRoute } from "@/lib/routes";

type VerifyRouteInput = {
  email: string;
  phoneNumber?: string | null;
  message?: string;
  error?: string;
};

export function buildVerifyRoute(input: VerifyRouteInput) {
  const params = new URLSearchParams({ email: input.email });

  if (input.phoneNumber) {
    params.set("phone", input.phoneNumber);
  }

  if (input.message) {
    params.set("message", input.message);
  }

  if (input.error) {
    params.set("error", input.error);
  }

  return asRoute(`/verify?${params.toString()}`);
}
