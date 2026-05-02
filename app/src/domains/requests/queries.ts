import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { studentRequests } from "@/db/schema";

export async function getMyStudentRequests(studentId: string) {
  const db = getDb();

  return db
    .select()
    .from(studentRequests)
    .where(eq(studentRequests.studentId, studentId))
    .orderBy(desc(studentRequests.createdAt));
}

export async function getStudentRequestForStudent(
  requestId: string,
  studentId: string,
) {
  const db = getDb();
  const [request] = await db
    .select()
    .from(studentRequests)
    .where(
      and(
        eq(studentRequests.id, requestId),
        eq(studentRequests.studentId, studentId),
      ),
    )
    .limit(1);

  return request ?? null;
}
