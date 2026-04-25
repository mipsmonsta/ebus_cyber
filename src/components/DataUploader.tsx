import React, { useCallback } from 'react';
import Papa from 'papaparse';
import type { ParseResult } from 'papaparse';
import { Upload } from 'lucide-react';
import type { BusMileage } from '../types';

interface Props {
  onDataLoaded: (data: BusMileage[]) => void;
}

// Extend Input HTML attributes for webkitdirectory support in TS
declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

export const DataUploader: React.FC<Props> = ({ onDataLoaded }) => {
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allData: BusMileage[] = [];
    const parsePromises: Promise<void>[] = [];

    Array.from(files).forEach((file) => {
      // Only process .csv files
      if (!file.name.toLowerCase().endsWith('.csv')) return;

      // Extract model name from filename (e.g., "Volvo 7900.csv" -> "Volvo 7900")
      const modelName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");

      const promise = new Promise<void>((resolve) => {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim().replace(/^\ufeff/, ""),
          complete: (results: ParseResult<any>) => {
            console.log(`Parsed file: ${file.name}`, results.data);
            const mappedData = results.data
              .map((row: any) => {
                // Find month and mileage keys regardless of case
                const monthKey = Object.keys(row).find(k => k.toLowerCase() === 'month' || k.toLowerCase().includes('month'));
                const mileageKey = Object.keys(row).find(k => k.toLowerCase() === 'mileage' || k.toLowerCase().includes('mileage'));
                
                if (monthKey && mileageKey && row[monthKey] !== undefined && row[monthKey] !== null) {
                  const mil = parseFloat(String(row[mileageKey]));
                  if (!isNaN(mil)) {
                    return {
                      Month: String(row[monthKey]).trim(),
                      Mileage: mil,
                      BusModel: modelName,
                    };
                  }
                }
                return null;
              })
              .filter((item): item is BusMileage => item !== null);
            
            console.log(`Mapped data for ${modelName}:`, mappedData);
            allData.push(...mappedData);
            resolve();
          },
          error: (error) => {
            console.error(`Error parsing ${file.name}:`, error);
            resolve();
          }
        });
      });
      parsePromises.push(promise);
    });

    await Promise.all(parsePromises);
    onDataLoaded(allData);
  }, [onDataLoaded]);

  return (
    <div className="flex flex-col items-center justify-center p-12 border border-cyber-accent/30 bg-cyber-bg/50 hover:bg-cyber-accent/5 transition-all cursor-pointer relative group">
      <input
        type="file"
        multiple
        webkitdirectory=""
        onChange={handleFileUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="p-4 border border-cyber-accent shadow-accent-glow mb-6 group-hover:scale-110 transition-transform">
        <Upload className="w-10 h-10 text-cyber-accent" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 tracking-[0.2em] uppercase">Initialize Fleet Data</h3>
      <p className="text-cyber-accent/60 text-[10px] font-mono tracking-widest uppercase">Target: /bus_models_data/</p>
      
      <div className="mt-8 flex gap-4">
        <div className="w-2 h-2 bg-cyber-accent"></div>
        <div className="w-2 h-2 bg-cyber-accent/30"></div>
        <div className="w-2 h-2 bg-cyber-accent/30"></div>
      </div>
    </div>
  );
};
