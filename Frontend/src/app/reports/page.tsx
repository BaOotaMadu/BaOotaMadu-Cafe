
import { Metadata } from "next";
import dynamic from "next/dynamic";

const Reports = dynamic(() => import('@/components/Reports'), { ssr: false });

export const metadata: Metadata = {
  title: "Reports & Analytics - MenuZen",
  description: "View and analyze your restaurant performance",
};

export default function ReportsPage() {
  return <Reports />;
}
