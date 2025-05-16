"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sidebar as ShadcnSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Image as ImageIcon, LogOut, Home, FileIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <ShadcnSidebar className="border-r border-primary/10 shadow-lg bg-card/95 backdrop-blur-sm">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-primary/10 px-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg transition-all duration-300 hover:scale-105 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center text-white shadow-md group-hover:shadow-primary/30 transition-all duration-300">
              <Home className="h-4 w-4" />
            </div>
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-primary transition-all duration-500">
              Do Anything
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4 px-2">
          <div className="text-xs uppercase text-muted-foreground font-medium tracking-wider px-3 py-1.5">
            应用
          </div>
          <nav className="grid items-start px-2 text-sm font-medium gap-0.5 mt-0.5">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 hover:translate-x-1 group",
                pathname === "/"
                  ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-zinc-900 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400"
              )}
            >
              <div
                className={cn(
                  "h-6 w-6 rounded-md flex items-center justify-center transition-all duration-300 shadow-sm",
                  pathname === "/"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-gradient-to-r from-purple-500/70 to-blue-500/70 text-white group-hover:from-purple-500 group-hover:to-blue-500"
                )}
              >
                <ImageIcon className="h-3 w-3" />
              </div>
              <span
                className={cn(
                  "font-medium text-sm transition-all duration-300",
                  pathname === "/"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
                    : "group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 group-hover:bg-clip-text group-hover:text-transparent"
                )}
              >
                图片格式转换
              </span>
            </Link>
          </nav>
          <nav className="grid items-start px-2 text-sm font-medium gap-0.5 mt-0.5">
            <Link
              href="/svg-sprite"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 hover:translate-x-1 group",
                pathname === "/svg-sprite"
                  ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-zinc-900 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400"
              )}
            >
              <div
                className={cn(
                  "h-6 w-6 rounded-md flex items-center justify-center transition-all duration-300 shadow-sm",
                  pathname === "/svg-sprite"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-gradient-to-r from-purple-500/70 to-blue-500/70 text-white group-hover:from-purple-500 group-hover:to-blue-500"
                )}
              >
                <FileIcon className="h-3 w-3" />
              </div>
              <span
                className={cn(
                  "font-medium text-sm transition-all duration-300",
                  pathname === "/svg-sprite"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
                    : "group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 group-hover:bg-clip-text group-hover:text-transparent"
                )}
              >
                svg雪碧图
              </span>
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Separator className="my-4 bg-primary/10" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 hover:bg-primary/10 transition-all duration-300 rounded-lg py-2.5"
              >
                <Avatar className="h-7 w-7 ring-1 ring-primary/30 transition-all duration-300 hover:ring-primary shadow-sm">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-blue-500 text-white font-medium text-xs">
                    用户
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-xs">个人设置</span>
                  <span className="text-[10px] text-muted-foreground">
                    管理您的账户
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl p-2 border-primary/10 shadow-lg animate-in fade-in-80 zoom-in-95"
            >
              <DropdownMenuItem className="rounded-lg py-2 px-3 cursor-pointer hover:bg-primary/10 transition-all duration-200">
                <Settings className="mr-2 h-4 w-4 text-primary" />
                <span>设置</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg py-2 px-3 cursor-pointer hover:bg-destructive/10 transition-all duration-200 text-destructive hover:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </ShadcnSidebar>
  );
}
