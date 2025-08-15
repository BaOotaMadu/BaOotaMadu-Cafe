import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Printer, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  tableId: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ tableId }) => {
  //console.log("Rendering QRCodeGenerator for table:", tableId);
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [showQR, setShowQR] = useState(false);

  //const baseUrl = "http://localhost:8080"; // Replace with your actual base URL
  const baseUrl =
    import.meta.env.VITE_API_BASE || "https://baootamadu.onrender.com";
  const qrValue = `${baseUrl}/user?table=${tableId}`;

  const handlePrint = () => {
    if (qrRef.current) {
      const printWindow = window.open("", "", "width=600,height=600");
      if (printWindow) {
        printWindow.document.write("<html><head><title>Print QR Code</title>");
        printWindow.document.write("<style>");
        printWindow.document.write(`
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; text-align: center; }
          .qr-container { margin: 20px auto; }
          h2 { margin-bottom: 5px; }
          p { margin-top: 5px; color: #666; }
        `);
        printWindow.document.write("</style></head><body>");
        printWindow.document.write(`<h2>Table ${tableId}</h2>`);
        printWindow.document.write("<p>Scan to order</p>");
        printWindow.document.write('<div class="qr-container">');
        printWindow.document.write(qrRef.current.innerHTML);
        printWindow.document.write("</div>");
        printWindow.document.write("</body></html>");
        printWindow.document.close();

        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }

      toast({
        title: "QR Code Ready",
        description: `Printing QR code for Table ${tableId}`,
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!showQR ? (
        <Button onClick={() => setShowQR(true)}>
          <QrCode className="mr-2" />
          Show QR Code
        </Button>
      ) : (
        <>
          <div ref={qrRef} className="p-4 bg-white rounded-md">
            <QRCodeSVG value={qrValue} size={200} level="H" />
            <div className="mt-2 text-center font-medium">Table {tableId}</div>
          </div>

          <Button onClick={handlePrint}>
            <Printer className="mr-2" />
            Print QR Code
          </Button>

          <Button variant="outline" onClick={() => setShowQR(false)}>
            Close
          </Button>
        </>
      )}
    </div>
  );
};

export default QRCodeGenerator;
