import React, { useEffect, useMemo, useState } from "react";
import { hardwareExplorerData } from "../../data/hardware";
import type { HardwareExplorerGroup, HardwareExplorerGroupId } from "../../types";
import { HardwareTabs } from "./HardwareTabs";
import { HardwareDetailPanel } from "./HardwareDetailPanel";
import { ServerDiagram } from "./ServerDiagram";
import { NasDiagram } from "./NasDiagram";
import { NetworkDiagram } from "./NetworkDiagram";
import { PowerDiagram } from "./PowerDiagram";
import { CalculatorModal } from "../ui/CalculatorModal";
import { StorageCalculatorForm } from "./StorageCalculatorForm";
import { UpsPoeCalculatorForm } from "./UpsPoeCalculatorForm";
import { Calculator } from "lucide-react";

import { GpuComparisonForm } from "./GpuComparisonForm";

export const HardwareExplorer: React.FC = () => {
  const [activeGroupId, setActiveGroupId] = useState<HardwareExplorerGroupId>("ai-server");
  const activeGroup = useMemo(
    () => hardwareExplorerData.find((group) => group.id === activeGroupId) ?? hardwareExplorerData[0],
    [activeGroupId]
  );
  const [selectedPartId, setSelectedPartId] = useState(activeGroup.defaultPartId);
  const [activeModal, setActiveModal] = useState<null | "storage" | "ups" | "gpu">(null);

  useEffect(() => {
    setSelectedPartId(activeGroup.defaultPartId);
  }, [activeGroup]);

  const selectedPart =
    activeGroup.parts.find((part) => part.id === selectedPartId) ?? activeGroup.parts[0];

  return (
    <div className="flex min-h-0 flex-1 flex-col" data-section-nav-ignore="true">
      <HardwareTabs
        groups={hardwareExplorerData}
        activeGroupId={activeGroupId}
        onSelect={setActiveGroupId}
      />

      <div className="min-h-0 flex-1 overflow-y-auto" data-section-nav-ignore="true">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)]">
          {/* Visual diagram & Quick Actions */}
          <div className="min-w-0 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] p-4 flex flex-col justify-between gap-4">
            <RenderDiagram
              group={activeGroup}
              selectedPartId={selectedPart.id}
              onSelectPart={setSelectedPartId}
            />

            {/* Quick Actions (Calculator Modals trigger) */}
            {activeGroupId === "nas-storage" && (
              <div className="flex justify-center border-t border-[var(--hairline)] pt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveModal("storage");
                  }}
                  className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] hover:bg-[var(--surface-soft)] px-4 py-2 text-xs font-semibold text-[var(--ink)] cursor-pointer transition-colors"
                >
                  <Calculator className="h-4 w-4" />
                  Mở bảng tính dung lượng NAS
                </button>
              </div>
            )}

            {activeGroupId === "ups-components" && (
              <div className="flex justify-center border-t border-[var(--hairline)] pt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveModal("ups");
                  }}
                  className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] hover:bg-[var(--surface-soft)] px-4 py-2 text-xs font-semibold text-[var(--ink)] cursor-pointer transition-colors"
                >
                  <Calculator className="h-4 w-4" />
                  Mở bảng tính UPS & PoE
                </button>
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="flex min-h-0 flex-col">
            <HardwareDetailPanel
              part={selectedPart}
              onOpenModal={setActiveModal}
            />
          </div>
        </div>
      </div>

      {/* Storage Calculator Modal */}
      <CalculatorModal
        open={activeModal === "storage"}
        onClose={() => setActiveModal(null)}
        title="Bảng Tính Dung Lượng Lưu Trữ NAS/RAID"
        description="Tính toán dung lượng thô, dung lượng khuyên dùng và dung lượng khả dụng theo cấu hình RAID thực tế."
      >
        <StorageCalculatorForm />
      </CalculatorModal>

      {/* UPS / PoE Calculator Modal */}
      <CalculatorModal
        open={activeModal === "ups"}
        onClose={() => setActiveModal(null)}
        title="Bảng Tính Công Suất Tải UPS & PoE Switch"
        description="Ước tính tải điện năng, thời gian lưu điện dự phòng của UPS và ngân sách PoE switch cho camera."
      >
        <UpsPoeCalculatorForm />
      </CalculatorModal>

      {/* GPU Comparison Modal */}
      <CalculatorModal
        open={activeModal === "gpu"}
        onClose={() => setActiveModal(null)}
        title="So sánh GPU server cho VMS247 AI Camera"
        description="So sánh các dòng GPU máy chủ chuyên dụng (Server-grade / Data-center GPU) tối ưu nhất."
      >
        <GpuComparisonForm />
      </CalculatorModal>
    </div>
  );
};

function RenderDiagram({
  group,
  selectedPartId,
  onSelectPart,
}: {
  group: HardwareExplorerGroup;
  selectedPartId: string;
  onSelectPart: (partId: string) => void;
}) {
  const props = { parts: group.parts, selectedPartId, onSelectPart };

  if (group.diagramType === "server") return <ServerDiagram {...props} />;
  if (group.diagramType === "nas") return <NasDiagram {...props} />;
  if (group.diagramType === "network") return <NetworkDiagram {...props} />;
  return <PowerDiagram {...props} />;
}
