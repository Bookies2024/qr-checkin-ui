import React, { useEffect, useState } from 'react';
import { IDetectedBarcode, Scanner as ScannerComponent } from '@yudiel/react-qr-scanner';
import { useApp } from '../hooks/useApp';

const SCANNER_CONFIG = {
  frameSize: 310,
  cornerThickness: 6,
  cornerLength: 100,
  frameDelay: 500,
  scanDelay: 3000,
  borderRadius: '15px'
};

const ScannerCorner = ({ position }) => {
  const [vAlign, hAlign] = position.split('-');
  return (
    <>
      <div
        style={{
          position: 'absolute',
          [vAlign]: 0,
          [hAlign]: 0,
          width: SCANNER_CONFIG.cornerLength,
          height: SCANNER_CONFIG.cornerThickness,
          backgroundColor: 'white',
        }}
      />
      <div
        style={{
          position: 'absolute',
          [vAlign]: 0,
          [hAlign]: 0,
          width: SCANNER_CONFIG.cornerThickness,
          height: SCANNER_CONFIG.cornerLength,
          backgroundColor: 'white',
        }}
      />
    </>
  );
};

const ScannerFrame = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: SCANNER_CONFIG.frameSize,
        height: SCANNER_CONFIG.frameSize,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      <ScannerCorner position="top-left" />
      <ScannerCorner position="top-right" />
      <ScannerCorner position="bottom-left" />
      <ScannerCorner position="bottom-right" />
    </div>
  );
};

const Scanner = () => {
  const [showFrame, setShowFrame] = useState(false);
  const { setQRScanData } = useApp()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowFrame(true);
    }, SCANNER_CONFIG.frameDelay);

    return () => clearTimeout(timeout);
  }, []);

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
        scanDelay={SCANNER_CONFIG.scanDelay}
        styles={{
          video: {
            borderRadius: SCANNER_CONFIG.borderRadius,
          },
        }}
      />

      {showFrame && <ScannerFrame />}
    </div>
  );
};

export default Scanner;