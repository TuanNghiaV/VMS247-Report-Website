import React from "react";
import { SectionShell } from "../layout/SectionShell";
import { HardwareExplorer } from "../hardware/HardwareExplorer";

interface SectionProps {
  isActive?: boolean;
}

export const HardwareBlueprint: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  return (
    <SectionShell id="hardware-blueprint" isActive={isActive} contentClassName="max-w-7xl">
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] tracking-tight">
          Thiết Kế Hạ Tầng & Cấu Hình Khuyến Nghị
        </h2>
        <p className="text-[var(--body)] text-sm mt-1">
          Khám phá mô hình hạ tầng phần cứng cho pilot 18 camera: AI Server, NAS, mạng và UPS.
        </p>
      </div>

      <HardwareExplorer />
    </SectionShell>
  );
};
