"use client";

import Link from "next/link";
import { Sun, Moon, User, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 shrink-0 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50 flex items-center justify-between px-5">
      {/* ロゴ */}
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-base tracking-tight hover:opacity-80 transition-opacity"
      >
        <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary text-primary-foreground">
          <PenLine className="h-4 w-4" />
        </span>
        CollabCanvas
      </Link>

      {/* 右側コントロール */}
      <div className="flex items-center gap-1">
        {/* ダークモード切替 */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="テーマ切替">
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* ユーザーアバター */}
        <button
          className="ml-1 h-8 w-8 rounded-full bg-primary/15 hover:bg-primary/25 transition-colors flex items-center justify-center ring-2 ring-border"
          aria-label="ユーザーメニュー"
        >
          <User className="h-4 w-4 text-primary" />
        </button>
      </div>
    </header>
  );
};
