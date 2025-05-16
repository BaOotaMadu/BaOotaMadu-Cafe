import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from "html5-qrcode";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (tableId: number) => void;
  onClose?: () => void;
  checkTableAvailability?: (tableId: number) => boolean;
}

const QRScanner = ({ onScan, onClose, checkTableAvailability }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Clean up the scanner when component unmounts
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error(err));
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      setIsScanning(true);
      setError(null);
      
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;
      
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // On success - extract table ID from QR code
          console.log("QR Code detected:", decodedText);
          
          // Extract table ID from URL parameters
          let tableId: number;
          
          try {
            const url = new URL(decodedText);
            tableId = parseInt(url.searchParams.get('table') || '0');
          } catch (err) {
            // If it's not a proper URL, try to parse the tableId directly
            const match = decodedText.match(/table=(\d+)/);
            tableId = match ? parseInt(match[1]) : 0;
          }
          
          if (tableId > 0) {
            // Check if table is already occupied
            if (checkTableAvailability && !checkTableAvailability(tableId)) {
              setError(`Table ${tableId} is already occupied or in service`);
              toast({
                title: "Table Not Available",
                description: `Table ${tableId} is already occupied or in service`,
                variant: "destructive"
              });
              return;
            }
            
            toast({
              title: "Table Found",
              description: `Successfully scanned Table ${tableId}`,
            });
            
            // Stop scanning after successful scan
            html5QrCode.stop().catch(err => console.error(err));
            setIsScanning(false);
            
            // Call the onScan callback with the table ID
            onScan(tableId);
          } else {
            setError("Invalid QR code format");
            toast({
              title: "Invalid QR Code",
              description: "Could not find a valid table number in the QR code",
              variant: "destructive"
            });
          }
        },
        (errorMessage) => {
          // Ignore errors during scanning, only show when a code is detected but invalid
          console.log("QR Scan error:", errorMessage);
        }
      );
    } catch (err) {
      setIsScanning(false);
      setError("Could not access camera. Please make sure you've granted camera permissions.");
      console.error("QR scanner error:", err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
      setIsScanning(false);
    }
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div id="qr-reader" className="w-full max-w-sm h-64 border rounded-md overflow-hidden"></div>
      
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex gap-3">
        {!isScanning ? (
          <Button onClick={startScanner}>
            Start Scanning
          </Button>
        ) : (
          <Button variant="outline" onClick={stopScanner}>
            Stop Scanning
          </Button>
        )}
        
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default QRScanner;
