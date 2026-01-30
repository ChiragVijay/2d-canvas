import type { User } from "@/types";
import { mockUser } from "./mock-data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getCurrentUser(): Promise<User> {
  await delay(200);
  return { ...mockUser };
}
