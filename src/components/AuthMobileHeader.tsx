"use client";

import { Menu } from "lucide-react";

export default function AuthMobileHeader() {
  return (
    <div className="mx-auto flex w-full max-w-[360px] items-center justify-between px-6 py-5 text-black md:hidden">
      <span className="text-[14px] font-semibold tracking-[0.04em]">GARDEN WORKDAY EVENT</span>
      <button
        type="button"
        aria-label="Open menu"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-black"
      >
        <Menu size={20} strokeWidth={2.25} />
      </button>
    </div>
  );
}
