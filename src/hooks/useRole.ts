"use client";

import { useUser } from "@clerk/nextjs";

export function useRole() {
  const { user } = useUser();
  return user?.publicMetadata?.role as "admin" | "volunteer" | undefined;
}
