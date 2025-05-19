import { FileIcon, ImageIcon } from "lucide-react";

export interface MenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export const menuItems: MenuItem[] = [
  {
    href: "/",
    label: "图片格式转换",
    icon: ImageIcon,
  },
  {
    href: "/svg-sprite",
    label: "svg雪碧图",
    icon: FileIcon,
  },
];

export const menuCategories = [
  {
    title: "应用",
    items: menuItems
  }
]; 