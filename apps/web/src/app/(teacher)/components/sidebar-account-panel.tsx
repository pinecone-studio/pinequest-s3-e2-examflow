"use client";

import { useUser } from "@clerk/nextjs";
import { AuthSignOutButton } from "@/components/auth-sign-out-button";

const getDisplayName = ({
  firstName,
  lastName,
  primaryEmail,
}: {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  primaryEmail: string;
}) => {
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  return fullName || primaryEmail.split("@")[0] || "Teacher";
};

const getInitials = ({
  displayName,
  firstName,
  lastName,
}: {
  displayName: string;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
}) => {
  const parts = [firstName, lastName].filter(Boolean);

  if (parts.length > 0) {
    return parts
      .map((part) => part?.[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
};

const getSecondaryLabel = (publicMetadata: Record<string, unknown>) => {
  const subject =
    publicMetadata.subject ??
    publicMetadata.subjectName ??
    publicMetadata.teacherSubject ??
    publicMetadata.department;

  if (typeof subject === "string") {
    const trimmed = subject.trim();
    if (trimmed.length > 0) {
      return trimmed.includes("багш") ? trimmed : `${trimmed} багш`;
    }
  }

  return "Багш";
};

export function SidebarAccountPanel() {
  const { isLoaded, user } = useUser();

  if (!isLoaded || !user) {
    return (
      <div className="space-y-3">
        <div className="flex h-[64px] items-center gap-3 rounded-[20px] border border-[#F0EEFA] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <div className="h-11 w-11 animate-pulse rounded-full bg-[#EEE9FF]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 animate-pulse rounded-full bg-[#EEE9FF]" />
            <div className="h-3 w-20 animate-pulse rounded-full bg-[#EEE9FF]" />
          </div>
        </div>
        <div className="h-11 animate-pulse rounded-[16px] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]" />
      </div>
    );
  }

  const primaryEmail =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "teacher@pinequest.mn";

  const displayName = getDisplayName({
    firstName: user.firstName,
    lastName: user.lastName,
    primaryEmail,
  });

  const initials = getInitials({
    displayName,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  const secondaryLabel = getSecondaryLabel(
    (user.publicMetadata as Record<string, unknown>) ?? {},
  );

  return (
    <div className="space-y-3">
      <div className="flex min-h-[64px] w-full items-center gap-3 rounded-[20px] border border-[#F0EEFA] bg-white px-4 py-3 text-left shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8A63FF_0%,#6434F8_100%)] text-[13px] font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold leading-5 text-[#17151F]">
            {displayName}
          </p>
          <p className="truncate text-[12px] leading-4 text-[#8B879A]">
            {secondaryLabel}
          </p>
        </div>
        <span className="sr-only">{primaryEmail}</span>
      </div>
      <AuthSignOutButton className="inline-flex h-11 w-full items-center justify-center rounded-[16px] border border-[#ECEAF8] bg-white px-4 text-[14px] font-semibold text-[#17151F] shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:border-[#D8D2F7] hover:bg-[#F8F6FF]" />
    </div>
  );
}
