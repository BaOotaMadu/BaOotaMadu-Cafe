
import { Metadata } from "next";
import dynamic from "next/dynamic";


const Tables = dynamic(() => import('@/components/Tables'), { ssr: false });

export const metadata: Metadata = {
  title: "Tables & Orders - MenuZen",
  description: "Manage your restaurant tables and active orders",
};

export default function TablesPage() {
  return <Tables />;
}
