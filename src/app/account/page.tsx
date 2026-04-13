"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import NavBarWrapper from "@/components/NavbarWrapper";

export default function AccountPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  return (
    <div>
      <NavBarWrapper />
      <main className="p-8 font-lora">
        <h1 className="text-4xl font-bold">My Account</h1>
        <div className="mt-8">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-[#d9a7a7] bg-[#f8d7d7] px-6 py-2 font-semibold text-black transition hover:brightness-95 active:brightness-90"
          >
            Log Out
          </button>
        </div>
      </main>
    </div>
  );
}
