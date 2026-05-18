import { useSyncExternalStore } from "react";
import type { User } from "@/types";
import { getStoredUser, subscribeToAuthChange } from "@/lib/api";

export function useStoredUser(): User | null | undefined {
  return useSyncExternalStore(subscribeToAuthChange, getStoredUser, () => undefined);
}
