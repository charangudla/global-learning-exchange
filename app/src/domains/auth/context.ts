import { eq } from "drizzle-orm";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getDb } from "@/db/client";
import { users, type User } from "@/db/schema";
import {
  hasDatabaseConfig,
  hasSupabaseConfig,
  isLocalAuthProvider
} from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getLocalSessionUser } from "./local";

type LocalAuthUser = {
  id: string;
  email: string;
};

export type CurrentUserContext =
  | {
      setupError: string;
      authUser: null;
      platformUser: null;
    }
  | {
      setupError: null;
      authUser: null;
      platformUser: null;
    }
  | {
      setupError: null;
      authUser: SupabaseUser | LocalAuthUser;
      platformUser: User | null;
    };

export async function getCurrentUserContext(): Promise<CurrentUserContext> {
  if (isLocalAuthProvider()) {
    if (!hasDatabaseConfig()) {
      return {
        setupError: "DATABASE_URL is not configured.",
        authUser: null,
        platformUser: null
      };
    }

    const platformUser = await getLocalSessionUser();

    if (!platformUser) {
      return {
        setupError: null,
        authUser: null,
        platformUser: null
      };
    }

    return {
      setupError: null,
      authUser: {
        id: platformUser.id,
        email: platformUser.email
      },
      platformUser
    };
  }

  if (!hasSupabaseConfig()) {
    return {
      setupError:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      authUser: null,
      platformUser: null
    };
  }

  if (!hasDatabaseConfig()) {
    return {
      setupError: "DATABASE_URL is not configured.",
      authUser: null,
      platformUser: null
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser }
  } = await supabase.auth.getUser();

  if (!authUser) {
    return {
      setupError: null,
      authUser: null,
      platformUser: null
    };
  }

  const db = getDb();
  const [platformUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser.id))
    .limit(1);

  return {
    setupError: null,
    authUser,
    platformUser: platformUser ?? null
  };
}
