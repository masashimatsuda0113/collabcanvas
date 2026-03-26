"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Clock, Users, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/button-variants";

const navItems = [
  { href: "/", label: "マイボード", icon: LayoutGrid },
  { href: "/recent", label: "最近のボード", icon: Clock },
  { href: "/shared", label: "共有ボード", icon: Users },
] as const;

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-sidebar flex flex-col py-4">
      {/* 新規作成ボタン */}
      <div className="px-3 mb-4">
        <Link
          href="/board/new"
          className={cn(buttonVariants({ variant: "default", size: "sm" }), "w-full gap-2")}
        >
          <Plus className="h-4 w-4" />
          新規作成
        </Link>
      </div>

      {/* ナビゲーション */}
      <nav className="flex flex-col gap-0.5 px-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
