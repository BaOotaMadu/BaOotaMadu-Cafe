
import { Metadata } from "next";
import dynamic from "next/dynamic";


const Menu = dynamic(() => import('@/components/Menu'), { ssr: false });

export const metadata: Metadata = {
  title: "Menu Management - MenuZen",
  description: "Create and manage your restaurant menu items",
};

export default function MenuPage() {
  return <Menu />;
}
