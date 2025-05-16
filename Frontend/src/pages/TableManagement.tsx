// import TableCard from '@/components/TableCard';
// import { Button } from '@/components/ui/button';
// import { PlusCircle } from 'lucide-react';

// const TableManagement = () => {
//   const dispatch = useAppDispatch();
//   const tables = useAppSelector(state => state.tables.tables);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Start the timer update interval
//     const stopTimeUpdates = dispatch(startTimeUpdates());
    
//     // Fetch initial table data
//     const fetchInitialTables = async () => {
//       try {
//         const tableData = await tableService.fetchTables();
        
//         // Add each table to Redux store
//         tableData.forEach(table => {
//           dispatch(addTable({ tableNumber: table.id }));
//         });
        
//         setLoading(false);
//       } catch (error) {
//         console.error('Failed to fetch tables:', error);
//         setLoading(false);
//       }
//     };
    
//     fetchInitialTables();
    
//     // Clean up when component unmounts
//     return () => {
//       stopTimeUpdates();
//     };
//   }, [dispatch]);

//   const handleAddTable = () => {
//     // Generate a new table number (simple increment from highest existing table)
//     const tableNumbers = Object.keys(tables).map(Number);
//     const nextTableNumber = tableNumbers.length > 0 
//       ? Math.max(...tableNumbers) + 1 
//       : 1;
    
//     dispatch(addTable({ tableNumber: nextTableNumber }));
//   };

//   const handleViewOrder = (tableNumber: number) => {
//     // Implementation for viewing order details
//     console.log(`View order for table ${tableNumber}`);
//     // This would typically open a modal or navigate to an order details page
//   };

//   const handleGenerateQR = (tableNumber: number) => {
//     // Implementation for generating QR code
//     console.log(`Generate QR for table ${tableNumber}`);
//     // This would typically open a modal with the QR code
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-64">Loading tables...</div>;
//   }

//   return (
//     <div className="container mx-auto py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Table Management</h1>
//         <Button onClick={handleAddTable} className="flex items-center gap-2">
//           <PlusCircle size={16} />
//           Add Table
//         </Button>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {Object.entries(tables).map(([tableNumber, tableData]) => (
//           <TableCard
//             key={tableNumber}
//             tableNumber={Number(tableNumber)}
//             onViewOrder={() => handleViewOrder(Number(tableNumber))}
//             onGenerateQR={() => handleGenerateQR(Number(tableNumber))}
//           />
//         ))}
        
//         {Object.keys(tables).length === 0 && (
//           <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
//             <p className="text-gray-500">No tables found. Add a table to get started.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TableManagement;