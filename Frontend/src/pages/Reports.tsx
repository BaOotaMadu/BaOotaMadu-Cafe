import { useState } from 'react';
import {
  BarChart3,
  FileBarChart,
  FileText,
  ArrowDownNarrowWide,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StatCard from '@/components/StatCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

const Reports = () => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<string>('week');

  // Mock sales data
  const salesData = [
    { date: 'Mon, Mar 10', orders: 42, revenue: 789.5, avgOrder: 18.8 },
    { date: 'Tue, Mar 11', orders: 38, revenue: 712.2, avgOrder: 18.74 },
    { date: 'Wed, Mar 12', orders: 45, revenue: 892.75, avgOrder: 19.84 },
    { date: 'Thu, Mar 13', orders: 52, revenue: 1043.65, avgOrder: 20.07 },
    { date: 'Fri, Mar 14', orders: 68, revenue: 1354.45, avgOrder: 19.91 },
    { date: 'Sat, Mar 15', orders: 72, revenue: 1580.9, avgOrder: 21.96 },
    { date: 'Sun, Mar 16', orders: 58, revenue: 1245.8, avgOrder: 21.48 },
  ];

  // Mock popular items
  const popularItems = [
    { name: 'Classic Cheeseburger', category: 'Main Course', orders: 145, revenue: 1885.55 },
    { name: 'Margherita Pizza', category: 'Main Course', orders: 118, revenue: 1769.82 },
    { name: 'Caesar Salad', category: 'Starters', orders: 92, revenue: 827.08 },
    { name: 'Chocolate Brownie', category: 'Desserts', orders: 87, revenue: 608.13 },
    { name: 'Grilled Salmon', category: 'Main Course', orders: 76, revenue: 1519.24 },
  ];

  const generateReport = () => {
    try {
      const doc = new jsPDF();

      let yOffset = 10; // Tracks the vertical position in the PDF

      // Add title
      doc.setFontSize(18);
      doc.text('Sales Report', 14, (yOffset += 10));

      // Add sales data table
      doc.setFontSize(12);
      doc.text('Sales Overview', 14, (yOffset += 15));
      const salesColumns = ['Date', 'Orders', 'Revenue', 'Avg. Order'];
      const salesRows = salesData.map((day) => [
        day.date,
        day.orders.toString(),
        `₹
₹
{day.revenue.toFixed(2)}`,
        `₹
₹
{day.avgOrder.toFixed(2)}`,
      ]);

      // Add table headers
      salesColumns.forEach((column, index) => {
        doc.text(column, 14 + index * 50, (yOffset += 10));
      });

      // Add table rows
      salesRows.forEach((row) => {
        row.forEach((cell, index) => {
          doc.text(cell, 14 + index * 50, (yOffset += 10));
        });
      });

      // Add popular items section
      doc.setFontSize(12);
      doc.text('Popular Items', 14, (yOffset += 20));
      const itemsColumns = ['Item', 'Category', 'Orders', 'Revenue'];
      const itemsRows = popularItems.map((item) => [
        item.name,
        item.category,
        item.orders.toString(),
        `₹
₹
{item.revenue.toFixed(2)}`,
      ]);

      // Add table headers
      itemsColumns.forEach((column, index) => {
        doc.text(column, 14 + index * 50, (yOffset += 10));
      });

      // Add table rows
      itemsRows.forEach((row) => {
        row.forEach((cell, index) => {
          doc.text(cell, 14 + index * 50, (yOffset += 10));
        });
      });

      // Save the PDF
      doc.save('report.pdf');

      // Show success toast
      toast({
        title: 'Report Generated',
        description: 'Your report has been generated and is ready to download.',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Show error toast if PDF generation fails
      toast({
        title: 'Error',
        description: 'Failed to generate the report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Track performance and generate detailed reports</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={generateReport}>
          <FileText size={16} />
          <span>Export PDF</span>
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="₹
7,619.25"
          icon={<BarChart3 className="text-navy" />}
          trend={{ value: '8.2%', positive: true }}
        />
        <StatCard
          title="Total Orders"
          value="375"
          icon={<FileBarChart className="text-navy" />}
          trend={{ value: '5.3%', positive: true }}
        />
        <StatCard
          title="Average Order"
          value="₹
20.32"
          icon={<ArrowDownNarrowWide className="text-navy" />}
          trend={{ value: '2.8%', positive: false }}
        />
        <StatCard
          title="Time Period"
          value="Last 7 Days"
          icon={<Calendar className="text-navy" />}
        />
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="sales" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="sales">Sales Overview</TabsTrigger>
            <TabsTrigger value="items">Popular Items</TabsTrigger>
          </TabsList>

          {/* Timeframe Select */}
          <Select id="timeframe" name="timeframe" value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sales Overview Tab */}
        <TabsContent value="sales" className="mt-0">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Avg. Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.map((day) => (
                  <TableRow key={day.date}>
                    <TableCell className="font-medium">{day.date}</TableCell>
                    <TableCell className="text-right">{day.orders}</TableCell>
                    <TableCell className="text-right">₹
{day.revenue.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹
{day.avgOrder.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Popular Items Tab */}
        <TabsContent value="items" className="mt-0">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popularItems.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">{item.orders}</TableCell>
                    <TableCell className="text-right">₹
{item.revenue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;