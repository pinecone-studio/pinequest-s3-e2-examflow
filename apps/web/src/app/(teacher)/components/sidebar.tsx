"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./dashboard-data";
import { SidebarAccountPanel } from "./sidebar-account-panel";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-[#ECEAF8] bg-[#FAFAFA] lg:min-h-screen lg:w-[256px] lg:min-w-[256px] lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-1 flex-col p-4 lg:px-4 lg:py-5">
        <div className="flex min-h-[84px] items-center px-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-12 items-center justify-center">
              <div className="absolute h-7 w-7 rotate-45 rounded-[8px] bg-[linear-gradient(135deg,#8A63FF_0%,#6434F8_100%)]" />
              <span className="relative text-[11px] font-bold text-white">
                EF
              </span>
            </div>
            <span className="text-[29px] font-semibold leading-none tracking-[-0.04em] text-[#18161F]">
              ExamFlow
            </span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-1 pb-4 pt-3 text-[14px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href
              ? pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`))
              : false;
            const itemClassName = `flex h-11 w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left text-[14px] font-medium leading-5 transition ${
              isActive
                ? "bg-[#6434F8] text-white shadow-[0_14px_32px_rgba(100,52,248,0.24)]"
                : "text-[#6B6E72] hover:bg-white hover:text-[#17151F] active:text-white"
            }`;
            const iconClassName = "h-[18px] w-[18px] shrink-0 text-current";

            if (!item.href || item.disabled) {
              return (
                <div
                  key={item.label}
                  aria-disabled="true"
                  className={itemClassName}
                >
                  <Icon className={iconClassName} />
                  <span>{item.label}</span>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={itemClassName}
              >
                <Icon className={iconClassName} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-1 pt-4">
          <SidebarAccountPanel />
        </div>
      </div>
    </aside>
  );
}
