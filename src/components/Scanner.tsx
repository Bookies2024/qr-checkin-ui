import React from 'react';
import { IDetectedBarcode, Scanner as ScannerComponent } from '@yudiel/react-qr-scanner';
import { useApp } from '../hooks/useApp';

const Scanner: React.FC = () => {
  const { setQRScanData, isQRScanPaused } = useApp()

  const handleScan = (result: IDetectedBarcode[] | null) => {
    if (result?.[0]) {
      setQRScanData(result[0].rawValue);
    }
  };

  return (
    <div className="relative">
      <ScannerComponent
        onScan={handleScan}
        allowMultiple
        paused={isQRScanPaused}
        scanDelay={1000}
        styles={{
          container: {
            aspectRatio: '1/1'
          },
          video: {
            borderRadius: 15
          },
        }}
      />

    </div>
  );
};

export default Scanner;