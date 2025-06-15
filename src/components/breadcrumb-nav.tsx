"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const pathNameMap = {
  "/svg-sprite": "svg雪碧图",
  "/": "图片格式转换",
};
export function BreadcrumbNav() {
  const pathname = usePathname();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">
            首页
          </BreadcrumbLink>
        </BreadcrumbItem>
        {!!pathNameMap[pathname as keyof typeof pathNameMap] && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {pathNameMap[pathname as keyof typeof pathNameMap]}
              </BreadcrumbPage>
            </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
  );
}
