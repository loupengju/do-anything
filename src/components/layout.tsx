'use client';

import { Sidebar } from "@/components/sidebar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background to-background/90">
      {/* 使用SidebarProvider包裹整个布局 */}
      <SidebarProvider>
        {/* 左侧边栏 */}
        <Sidebar />
        
        {/* 右侧内容区域 */}
        <div className="flex flex-col flex-1 overflow-hidden bg-background/50 backdrop-blur-sm transition-all duration-300">
          {/* 顶部面包屑 */}
          <BreadcrumbNav />
          
          {/* 内容区域 - 添加max-w-full确保内容不会溢出 */}
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 animate-[fadeIn_0.5s_ease-in-out]">
            <div className="relative max-w-full mx-auto">
              {/* 主要内容 - 添加宽度限制防止溢出 */}
              <div className="relative z-10 w-full overflow-hidden">
                {children}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
