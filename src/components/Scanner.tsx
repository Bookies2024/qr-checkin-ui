import React from 'react';
import { IDetectedBarcode, Scanner as ScannerComponent } from '@yudiel/react-qr-scanner';
import { useApp } from '../hooks/useApp';

interface ScannerProps {
  onScan: (result: IDetectedBarcode[] | null) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan }) => {
  const { isQRScanPaused } = useApp();

  return (
    <div className="relative">
      <ScannerComponent
        onScan={onScan}
        allowMultiple
        paused={isQRScanPaused}
        scanDelay={1000}
        styles={{
          container: {
            aspectRatio: '1/1',
          },
          video: {
            borderRadius: 15,
          },
        }}
      />
    </div>
  );
};

export default Scanner;