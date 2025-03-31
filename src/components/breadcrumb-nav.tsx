'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";

export function BreadcrumbNav() {
  const pathname = usePathname();
  
  // 简单的面包屑逻辑，可以根据实际路由结构扩展
  const isHome = pathname === "/";
  
  return (
    <div className="h-16 border-b border-primary/10 flex items-center px-4 md:px-6 bg-card/30 backdrop-blur-sm shadow-md animate-[fadeIn_0.3s_ease-in-out]">
      <Breadcrumb className="w-full">
        <BreadcrumbList className="text-sm md:text-base flex items-center">
          <BreadcrumbItem className="transition-all duration-300 hover:scale-105">
            <BreadcrumbLink href="/" className="text-primary hover:text-primary/80 transition-colors duration-300 font-medium flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="h-3 w-3 text-primary" />
              </div>
              <span>首页</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {!isHome && (
            <>
              <BreadcrumbSeparator className="text-muted-foreground/50">
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <span className="text-xs text-blue-500 font-bold">转</span>
                  </div>
                  <span>图片格式转换</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}