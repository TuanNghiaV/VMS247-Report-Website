import React, { useMemo, useState } from "react";
import { calculateStorage } from "../../utils/storageCalculator";
import { cn } from "../../utils/cn";
import { Info, Database, AlertTriangle, RefreshCw } from "lucide-react";

interface StorageCalculatorFormProps {
  onClose?: () => void;
}

export const StorageCalculatorForm: React.FC<StorageCalculatorFormProps> = () => {
  const [cameraCount, setCameraCount] = useState(18);
  const [bitrate, setBitrate] = useState(4);
  const [retention, setRetention] = useState(30);
  const [diskCount, setDiskCount] = useState(8);
  const [diskSize, setDiskSize] = useState(10);
  const [raidMode, setRaidMode] = useState<"No RAID" | "RAID 5" | "RAID 6" | "RAID 10">("RAID 6");

  const outputs = useMemo(() => {
    return calculateStorage({
      cameraCount,
      bitrateMbps: bitrate,
      retentionDays: retention,
      recordingMode: "continuous",
      raidType: raidMode,
      diskCapacityTB: diskSize,
      diskCount,
    });
  }, [cameraCount, bitrate, retention, diskCount, diskSize, raidMode]);

  const handleReset = () => {
    setCameraCount(18);
    setBitrate(4);
    setRetention(30);
    setDiskCount(8);
    setDiskSize(10);
    setRaidMode("RAID 6");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[var(--body)]" data-section-nav-ignore="true">
      {/* Inputs Column */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2">
          <span className="font-bold text-[var(--ink)] font-mono uppercase text-[10px]">Thông số cấu hình</span>
          <button
            type="button"
            onClick={handleReset}
            className="text-[10px] flex items-center gap-1 font-mono text-[var(--body)] hover:text-[var(--ink)] cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" /> Đặt lại
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-1">Số lượng camera</label>
            <input
              type="number"
              value={cameraCount}
              min={1}
              onChange={(e) => setCameraCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-10 sm:h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] px-3 text-[var(--ink)] font-mono focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-1">Băng thông (Mbps/camera)</label>
            <select
              value={bitrate}
              onChange={(e) => setBitrate(parseInt(e.target.value))}
              className="h-10 sm:h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] px-2.5 text-[var(--ink)] font-mono focus:outline-none"
            >
              <option value={2}>2 Mbps (720p / H.265)</option>
              <option value={4}>4 Mbps (1080p Standard)</option>
              <option value={6}>6 Mbps (1080p High Quality)</option>
              <option value={8}>8 Mbps (4K Lite)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-1">Số ngày lưu trữ</label>
            <input
              type="number"
              value={retention}
              min={1}
              onChange={(e) => setRetention(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-10 sm:h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] px-3 text-[var(--ink)] font-mono focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-1">Dung lượng mỗi ổ (TB)</label>
            <select
              value={diskSize}
              onChange={(e) => setDiskSize(parseInt(e.target.value))}
              className="h-10 sm:h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] px-2.5 text-[var(--ink)] font-mono focus:outline-none"
            >
              {[4, 6, 8, 10, 12, 16, 20].map((v) => (
                <option key={v} value={v}>{v} TB</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-1">Số lượng khay đĩa</label>
            <input
              type="number"
              value={diskCount}
              min={1}
              onChange={(e) => setDiskCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-10 sm:h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] px-3 text-[var(--ink)] font-mono focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-1">Cấu hình RAID</label>
            <select
              value={raidMode}
              onChange={(e) => setRaidMode(e.target.value as any)}
              className="h-10 sm:h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] px-2.5 text-[var(--ink)] font-mono focus:outline-none"
            >
              <option value="No RAID">No RAID</option>
              <option value="RAID 5">RAID 5</option>
              <option value="RAID 6">RAID 6</option>
              <option value="RAID 10">RAID 10</option>
            </select>
          </div>
        </div>
      </div>

      {/* Outputs Column */}
      <div className="space-y-4 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2">
            <span className="font-bold text-[var(--ink)] font-mono uppercase text-[10px]">Kết quả tính toán</span>
          </div>

          <div className={cn(
            "p-3 rounded-lg border flex items-center justify-between font-mono",
            outputs.status === "green"
              ? "bg-green-500/10 border-green-500/20 text-green-600"
              : outputs.status === "amber"
                ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600"
                : "bg-red-500/10 border-red-500/20 text-red-500"
          )}>
            <div className="flex items-center gap-1.5">
              <Database className="h-4 w-4" />
              <span className="font-semibold">
                {outputs.status === "green" ? "Đủ dung lượng" : outputs.status === "amber" ? "Cần dự phòng" : "Thiếu dung lượng"}
              </span>
            </div>
            <span className="font-bold text-sm">
              {outputs.raidUsableTB.toFixed(1)} / {outputs.recommendedTB.toFixed(1)} TB
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="border border-[var(--hairline)] rounded-lg p-2.5 bg-[var(--canvas-soft)]">
              <span className="block text-[9px] font-bold text-[var(--mute)] uppercase">Thô (Raw)</span>
              <span className="text-sm font-bold font-mono text-[var(--ink)]">{outputs.rawTB.toFixed(1)} TB</span>
            </div>
            <div className="border border-[var(--hairline)] rounded-lg p-2.5 bg-[var(--canvas-soft)]">
              <span className="block text-[9px] font-bold text-[var(--mute)] uppercase">Đề xuất (+30%)</span>
              <span className="text-sm font-bold font-mono text-[var(--ink)]">{outputs.recommendedTB.toFixed(1)} TB</span>
            </div>
            <div className="border border-[var(--hairline)] rounded-lg p-2.5 bg-[var(--canvas-soft)]">
              <span className="block text-[9px] font-bold text-[var(--mute)] uppercase">Khả dụng RAID</span>
              <span className="text-sm font-bold font-mono text-[var(--ink)]">{outputs.raidUsableTB.toFixed(1)} TB</span>
            </div>
          </div>

          <div className="p-3 bg-[var(--canvas-soft)] border border-[var(--hairline)] rounded-lg flex items-start gap-1.5">
            <Info className="h-4 w-4 text-[var(--mute)] shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed text-[var(--body)]">{outputs.suggestion}</p>
          </div>
        </div>

        <div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg flex items-start gap-1.5 mt-auto">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed text-amber-600 font-medium">
            <strong>Lưu ý bắt buộc:</strong> RAID giúp chịu lỗi ổ cứng, nhưng không thay thế backup. Dữ liệu quan trọng như database, cấu hình, model và bằng chứng sự kiện vẫn cần chính sách sao lưu riêng.
          </p>
        </div>
      </div>
    </div>
  );
};
