import type { VendorRow } from '../types';

export interface CostCalculations {
  serverLow: number;
  serverHigh: number;
  serverRecommended: number;

  nasLow: number;
  nasHigh: number;
  nasRecommended: number;

  hddLow: number;
  hddHigh: number;
  hddRecommended: number;

  networkLow: number;
  networkHigh: number;
  networkRecommended: number;

  infraLow: number;
  infraHigh: number;
  infraRecommended: number;

  cameraLow: number;
  cameraHigh: number;
  cameraRecommended: number;

  totalLow: number;
  totalHigh: number;
  totalRecommended: number;
}

export function calculateCostEstimator(
  vendorRows: VendorRow[],
  quantities: { [key: string]: number },
  cameraReplaceCount: number,
  cameraReplacePriceRange: { low: number; high: number }
): CostCalculations {
  // Find prices from rows
  const getRowPrices = (id: string) => {
    const row = vendorRows.find((r) => r.id === id);
    if (row) {
      return {
        low: row.lowPrice,
        high: row.highPrice,
        rec: (row.lowPrice + row.highPrice) / 2, // Recommended is the average
      };
    }
    return { low: 0, high: 0, rec: 0 };
  };

  const gpu = getRowPrices('gpu-l4');
  const serverBase = getRowPrices('server-2u');
  const nas = getRowPrices('nas-8bay');
  const hdd = getRowPrices('hdd-set');
  const poeSwitch = getRowPrices('poe-switch');
  const coreSwitch = getRowPrices('switch-core-10g');
  const ups = getRowPrices('ups-3kva');
  const rack = getRowPrices('rack-accessories');

  // Quantities
  const qGpu = quantities['gpu-l4'] ?? 1;
  const qServer = quantities['server-2u'] ?? 1;
  const qNas = quantities['nas-8bay'] ?? 1;
  const qHdd = quantities['hdd-set'] ?? 1;
  const qPoe = quantities['poe-switch'] ?? 1;
  const qCore = quantities['switch-core-10g'] ?? 1;
  const qUps = quantities['ups-3kva'] ?? 1;
  const qRack = quantities['rack-accessories'] ?? 1;

  // Components calculations (in Million VND)
  // 1. AI Server + NVIDIA L4
  const serverLow = gpu.low * qGpu + serverBase.low * qServer;
  const serverHigh = gpu.high * qGpu + serverBase.high * qServer;
  const serverRecommended = gpu.rec * qGpu + serverBase.rec * qServer;

  // 2. NAS 8-bay
  const nasLow = nas.low * qNas;
  const nasHigh = nas.high * qNas;
  const nasRecommended = nas.rec * qNas;

  // 3. HDD Set
  const hddLow = hdd.low * qHdd;
  const hddHigh = hdd.high * qHdd;
  const hddRecommended = hdd.rec * qHdd;

  // 4. 10GbE + PoE Network
  const networkLow = poeSwitch.low * qPoe + coreSwitch.low * qCore;
  const networkHigh = poeSwitch.high * qPoe + coreSwitch.high * qCore;
  const networkRecommended = poeSwitch.rec * qPoe + coreSwitch.rec * qCore;

  // 5. UPS + rack + cables
  const infraLow = ups.low * qUps + rack.low * qRack;
  const infraHigh = ups.high * qUps + rack.high * qRack;
  const infraRecommended = ups.rec * qUps + rack.rec * qRack;

  // 6. Camera replacement
  const cameraLow = cameraReplaceCount * cameraReplacePriceRange.low;
  const cameraHigh = cameraReplaceCount * cameraReplacePriceRange.high;
  const cameraRecommended = cameraReplaceCount * ((cameraReplacePriceRange.low + cameraReplacePriceRange.high) / 2);

  // Totals
  const totalLow = serverLow + nasLow + hddLow + networkLow + infraLow + cameraLow;
  const totalHigh = serverHigh + nasHigh + hddHigh + networkHigh + infraHigh + cameraHigh;
  const totalRecommended =
    serverRecommended +
    nasRecommended +
    hddRecommended +
    networkRecommended +
    infraRecommended +
    cameraRecommended;

  return {
    serverLow,
    serverHigh,
    serverRecommended,
    nasLow,
    nasHigh,
    nasRecommended,
    hddLow,
    hddHigh,
    hddRecommended,
    networkLow,
    networkHigh,
    networkRecommended,
    infraLow,
    infraHigh,
    infraRecommended,
    cameraLow,
    cameraHigh,
    cameraRecommended,
    totalLow,
    totalHigh,
    totalRecommended,
  };
}
