import React, { useState, useEffect } from "react";
import { SectionShell } from "../layout/SectionShell";
import { GlassCard } from "../ui/GlassCard";
import { cn } from "../../utils/cn";
import { Database, Zap, Cpu, CircleDollarSign, RefreshCw, AlertTriangle } from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

export const InfrastructureCalculators: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  const [activeTab, setActiveTab] = useState<"storage" | "ups" | "poe" | "cost">("storage");

  // --- STORAGE CALCULATOR STATES ---
  const [storageCameras, setStorageCameras] = useState(18);
  const [storageBitrate, setStorageBitrate] = useState(2); // Mbps
  const [storageRetention, setStorageRetention] = useState(30); // days
  const [storageMode, setStorageMode] = useState<"continuous" | "event" | "hybrid">("continuous");
  const [storageRaid, setStorageRaid] = useState<"none" | "raid5" | "raid6" | "raid10">("raid6");
  const [storageDiskSize, setStorageDiskSize] = useState(10); // TB
  const [storageDiskCount, setStorageDiskCount] = useState(8);

  const [storageOutputs, setStorageOutputs] = useState({
    dailyGB: 0,
    rawTB: 0,
    recommendedTB: 0,
    usableTB: 0,
    status: "green" as "green" | "amber" | "red",
    suggestion: "",
  });

  useEffect(() => {
    let modeMultiplier = 1.0;
    if (storageMode === "hybrid") modeMultiplier = 0.5;
    if (storageMode === "event") modeMultiplier = 0.15;

    const dailyGB = storageCameras * storageBitrate * 10.8 * modeMultiplier;
    const rawTB = (dailyGB * storageRetention) / 1024;
    const recommendedTB = rawTB * 1.3;

    let usableTB = 0;
    if (storageRaid === "none") {
      usableTB = storageDiskCount * storageDiskSize;
    } else if (storageRaid === "raid5") {
      usableTB = (storageDiskCount - 1) * storageDiskSize;
    } else if (storageRaid === "raid6") {
      usableTB = (storageDiskCount - 2) * storageDiskSize;
    } else if (storageRaid === "raid10") {
      usableTB = (storageDiskCount * storageDiskSize) / 2;
    }

    let status: "green" | "amber" | "red" = "green";
    if (usableTB < rawTB) {
      status = "red";
    } else if (usableTB >= rawTB && usableTB < recommendedTB) {
      status = "amber";
    }

    let suggestion = "Hạ tầng lưu trữ khả dụng ĐỦ đáp ứng yêu cầu khuyến nghị.";
    if (status === "red") {
      suggestion = "CẢNH BÁO: Dung lượng đĩa khả dụng KHÔNG đủ! Cần nâng dung lượng HDD hoặc cấu hình thêm khay đĩa.";
    } else if (status === "amber") {
      suggestion = "LƯU Ý: Dung lượng đĩa vừa sát mức thô, khuyến nghị bổ sung khay đĩa để đạt 30% khoảng trống an toàn.";
    }

    setStorageOutputs({
      dailyGB,
      rawTB,
      recommendedTB,
      usableTB,
      status,
      suggestion,
    });
  }, [storageCameras, storageBitrate, storageRetention, storageMode, storageRaid, storageDiskSize, storageDiskCount]);

  // --- UPS STATES ---
  const [upsServerW, setUpsServerW] = useState(500);
  const [upsNasW, setUpsNasW] = useState(120);
  const [upsSwitchW, setUpsSwitchW] = useState(150);
  const [upsOtherW, setUpsOtherW] = useState(50);
  const [upsSizeKva, setUpsSizeKva] = useState(3.0); // kVA
  const [upsPf, setUpsPf] = useState(0.9);

  const [upsOutputs, setUpsOutputs] = useState({
    totalLoadW: 0,
    upsMaxW: 0,
    loadPercent: 0,
    runtimeMinutes: 0,
    status: "good" as "good" | "warning" | "danger",
    recommendation: "",
  });

  useEffect(() => {
    const totalLoadW = upsServerW + upsNasW + upsSwitchW + upsOtherW;
    const upsMaxW = upsSizeKva * 1000 * upsPf;
    const loadPercent = (totalLoadW / upsMaxW) * 100;

    let batteryWh = 800;
    if (upsSizeKva === 2.0) batteryWh = 500;
    if (upsSizeKva === 3.0) batteryWh = 800;
    if (upsSizeKva === 5.0) batteryWh = 1400;

    const runtimeMinutes = (batteryWh * 0.8 / totalLoadW) * 60;

    let status: "good" | "warning" | "danger" = "good";
    let recommendation = "Tốt. Thời gian lưu điện đảm bảo vận hành ổn định và đồng bộ hệ thống.";

    if (runtimeMinutes < 10) {
      status = "danger";
      recommendation = "CẢNH BÁO: Thời gian lưu điện quá thấp (< 10 phút). Chưa đủ an toàn để tắt hệ thống.";
    } else if (runtimeMinutes >= 10 && runtimeMinutes <= 20) {
      status = "warning";
      recommendation = "Đủ để shutdown hệ thống an toàn thông qua cảnh báo từ xa.";
    }

    if (loadPercent > 100) {
      status = "danger";
      recommendation = "CẢNH BÁO QUÁ TẢI: Tổng tải điện năng vượt quá công suất tối đa của UPS!";
    }

    setUpsOutputs({
      totalLoadW,
      upsMaxW,
      loadPercent,
      runtimeMinutes,
      status,
      recommendation,
    });
  }, [upsServerW, upsNasW, upsSwitchW, upsOtherW, upsSizeKva, upsPf]);

  // --- POE STATES ---
  const [poeCameras, setPoeCameras] = useState(18);
  const [poeWattPerCamera, setPoeWattPerCamera] = useState(8);
  const [poeSwitchBudget, setPoeSwitchBudget] = useState(250);

  const [poeOutputs, setPoeOutputs] = useState({
    requiredPoE: 0,
    recommendedPoE: 0,
    isSufficient: false,
  });

  useEffect(() => {
    const requiredPoE = poeCameras * poeWattPerCamera;
    const recommendedPoE = requiredPoE * 1.25;
    const isSufficient = poeSwitchBudget >= recommendedPoE;

    setPoeOutputs({
      requiredPoE,
      recommendedPoE,
      isSufficient,
    });
  }, [poeCameras, poeWattPerCamera, poeSwitchBudget]);

  // --- COST STATES ---
  const [costQtyServer, setCostQtyServer] = useState(1);
  const [costPriceServer, setCostPriceServer] = useState(420); // Triệu VNĐ
  const [costQtyNas, setCostQtyNas] = useState(1);
  const [costPriceNas, setCostPriceNas] = useState(80);
  const [costQtyHdd, setCostQtyHdd] = useState(8);
  const [costPriceHdd, setCostPriceHdd] = useState(10);
  const [costQtyNet, setCostQtyNet] = useState(1);
  const [costPriceNet, setCostPriceNet] = useState(80);
  const [costQtyUps, setCostQtyUps] = useState(1);
  const [costPriceUps, setCostPriceUps] = useState(60);
  const [costQtyReplace, setCostQtyReplace] = useState(0); // Camera replacement
  const [costPriceReplace, setCostPriceReplace] = useState(4);

  const totalCost =
    costQtyServer * costPriceServer +
    costQtyNas * costPriceNas +
    costQtyHdd * costPriceHdd +
    costQtyNet * costPriceNet +
    costQtyUps * costPriceUps +
    costQtyReplace * costPriceReplace;

  const handleReset = () => {
    // Storage reset
    setStorageCameras(18);
    setStorageBitrate(2);
    setStorageRetention(30);
    setStorageMode("continuous");
    setStorageRaid("raid6");
    setStorageDiskSize(10);
    setStorageDiskCount(8);

    // UPS reset
    setUpsServerW(500);
    setUpsNasW(120);
    setUpsSwitchW(150);
    setUpsOtherW(50);
    setUpsSizeKva(3.0);
    setUpsPf(0.9);

    // PoE reset
    setPoeCameras(18);
    setPoeWattPerCamera(8);
    setPoeSwitchBudget(250);

    // Cost reset
    setCostQtyServer(1);
    setCostPriceServer(420);
    setCostQtyNas(1);
    setCostPriceNas(80);
    setCostQtyHdd(8);
    setCostPriceHdd(10);
    setCostQtyNet(1);
    setCostPriceNet(80);
    setCostQtyUps(1);
    setCostPriceUps(60);
    setCostQtyReplace(0);
  };

  return (
    <SectionShell id="infrastructure-calculators" isActive={isActive}>
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] tracking-tight">
          Bộ Công Cụ Tính Toán Hạ Tầng
        </h2>
        <p className="text-[var(--body)] text-sm mt-1">
          Thiết lập thông số kỹ thuật để tính toán dung lượng lưu trữ NAS, công suất tải điện UPS, PoE Switch và dự toán sơ bộ.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4" data-section-nav-ignore="true">
        <button
          onClick={() => setActiveTab("storage")}
          className={cn(
            "px-3.5 py-1.5 rounded-[var(--radius-pill)] border text-xs font-semibold font-mono cursor-pointer flex items-center gap-1.5 transition-all focus:outline-none",
            activeTab === "storage"
              ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-text)] font-bold shadow-sm"
              : "bg-[var(--canvas-soft)] border-[var(--hairline-strong)] text-[var(--body)] hover:bg-[var(--surface-soft)]"
          )}
        >
          <Database className="h-3.5 w-3.5" />
          Lưu Trữ NAS
        </button>
        <button
          onClick={() => setActiveTab("ups")}
          className={cn(
            "px-3.5 py-1.5 rounded-[var(--radius-pill)] border text-xs font-semibold font-mono cursor-pointer flex items-center gap-1.5 transition-all focus:outline-none",
            activeTab === "ups"
              ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-text)] font-bold shadow-sm"
              : "bg-[var(--canvas-soft)] border-[var(--hairline-strong)] text-[var(--body)] hover:bg-[var(--surface-soft)]"
          )}
        >
          <Zap className="h-3.5 w-3.5" />
          Thời Lưu Điện UPS
        </button>
        <button
          onClick={() => setActiveTab("poe")}
          className={cn(
            "px-3.5 py-1.5 rounded-[var(--radius-pill)] border text-xs font-semibold font-mono cursor-pointer flex items-center gap-1.5 transition-all focus:outline-none",
            activeTab === "poe"
              ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-text)] font-bold shadow-sm"
              : "bg-[var(--canvas-soft)] border-[var(--hairline-strong)] text-[var(--body)] hover:bg-[var(--surface-soft)]"
          )}
        >
          <Cpu className="h-3.5 w-3.5" />
          Cấp Nguồn PoE
        </button>
        <button
          onClick={() => setActiveTab("cost")}
          className={cn(
            "px-3.5 py-1.5 rounded-[var(--radius-pill)] border text-xs font-semibold font-mono cursor-pointer flex items-center gap-1.5 transition-all focus:outline-none",
            activeTab === "cost"
              ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-text)] font-bold shadow-sm"
              : "bg-[var(--canvas-soft)] border-[var(--hairline-strong)] text-[var(--body)] hover:bg-[var(--surface-soft)]"
          )}
        >
          <CircleDollarSign className="h-3.5 w-3.5" />
          Dự Toán Thiết Bị
        </button>

        <button
          onClick={handleReset}
          className="ml-auto text-[10px] flex items-center gap-1 font-semibold font-mono text-[var(--body)] hover:text-[var(--ink)] cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" /> Đặt lại tất cả
        </button>
      </div>

      {/* Content pane */}
      <div
        className="flex-1 overflow-y-auto pr-1 max-h-[calc(100svh-280px)]"
        data-section-nav-ignore="true"
      >
        {activeTab === "storage" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Inputs */}
            <div className="space-y-3.5 text-xs">
              <GlassCard className="p-4 border border-[var(--hairline-strong)]" hoverGlow={false}>
                <span className="font-bold text-[var(--ink)] block mb-3 font-mono">Thông số luồng video</span>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">Số lượng camera ({storageCameras})</label>
                    <input
                      type="range"
                      min="1"
                      max="150"
                      value={storageCameras}
                      onChange={(e) => setStorageCameras(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-[var(--canvas-soft)] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">Băng thông camera ({storageBitrate} Mbps)</label>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={storageBitrate}
                      onChange={(e) => setStorageBitrate(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-[var(--canvas-soft)] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">Ngày lưu trữ ({storageRetention} ngày)</label>
                    <input
                      type="range"
                      min="1"
                      max="90"
                      value={storageRetention}
                      onChange={(e) => setStorageRetention(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-[var(--canvas-soft)] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">Chế độ ghi hình</label>
                    <select
                      value={storageMode}
                      onChange={(e) => setStorageMode(e.target.value as any)}
                      className="w-full h-8 px-2 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)]"
                    >
                      <option value="continuous">Ghi hình liên tục 24/7 (100% load)</option>
                      <option value="hybrid">Hybrid (Ghi sự kiện + luồng phụ 24/7)</option>
                      <option value="event">Chỉ ghi sự kiện phát hiện (15% load)</option>
                    </select>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-4 border border-[var(--hairline-strong)]" hoverGlow={false}>
                <span className="font-bold text-[var(--ink)] block mb-3 font-mono">Thông số RAID NAS</span>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">Kiểu cấu hình RAID</label>
                    <select
                      value={storageRaid}
                      onChange={(e) => setStorageRaid(e.target.value as any)}
                      className="w-full h-8 px-2 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] font-mono"
                    >
                      <option value="none">No RAID (Không bảo vệ)</option>
                      <option value="raid5">RAID 5 (Dự phòng 1 ổ đĩa)</option>
                      <option value="raid6">RAID 6 (Dự phòng 2 ổ đĩa - Khuyên dùng)</option>
                      <option value="raid10">RAID 10 (Gương chia dải)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-[var(--body)] mb-1">Dung lượng ổ (TB)</label>
                      <select
                        value={storageDiskSize}
                        onChange={(e) => setStorageDiskSize(parseInt(e.target.value))}
                        className="w-full h-8 px-2 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] font-mono"
                      >
                        {[4, 8, 10, 12, 16, 20].map((sz) => (
                          <option key={sz} value={sz}>{sz} TB</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--body)] mb-1">Số lượng đĩa cứng</label>
                      <select
                        value={storageDiskCount}
                        onChange={(e) => setStorageDiskCount(parseInt(e.target.value))}
                        className="w-full h-8 px-2 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] font-mono"
                      >
                        {[4, 6, 8, 12].map((cnt) => (
                          <option key={cnt} value={cnt}>{cnt} HDD</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Outputs */}
            <div className="lg:col-span-2 space-y-4">
              <div className={cn(
                "p-4 rounded-[var(--radius-card)] border text-xs font-semibold flex items-center justify-between transition-colors",
                storageOutputs.status === "green"
                  ? "bg-green-500/10 border-green-500/20 text-green-600"
                  : storageOutputs.status === "amber"
                  ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600"
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              )}>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>{storageOutputs.suggestion}</span>
                </div>
                <span className="font-mono text-sm font-bold">
                  {storageOutputs.usableTB.toFixed(1)} / {storageOutputs.recommendedTB.toFixed(1)} TB
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="p-4 border border-[var(--hairline)]" hoverGlow={false}>
                  <span className="text-[9px] uppercase font-bold text-[var(--mute)] tracking-wider block mb-1">Dung lượng thô (Raw):</span>
                  <h4 className="text-xl font-bold font-mono text-[var(--ink)] mb-0.5">
                    {storageOutputs.rawTB.toFixed(2)} TB
                  </h4>
                  <p className="text-[10px] text-[var(--body)]">Mỗi ngày sinh ra: {storageOutputs.dailyGB.toFixed(0)} GB</p>
                </GlassCard>

                <GlassCard className="p-4 border border-[var(--hairline)]" hoverGlow={false}>
                  <span className="text-[9px] uppercase font-bold text-[var(--mute)] tracking-wider block mb-1">Yêu cầu (+30% Headroom):</span>
                  <h4 className="text-xl font-bold font-mono text-[var(--ink)] mb-0.5">
                    {storageOutputs.recommendedTB.toFixed(2)} TB
                  </h4>
                  <p className="text-[10px] text-[var(--body)]">Khoảng đệm an toàn chống phân mảnh.</p>
                </GlassCard>

                <GlassCard className="p-4 border border-[var(--hairline)]" hoverGlow={false}>
                  <span className="text-[9px] uppercase font-bold text-[var(--mute)] tracking-wider block mb-1">Khả dụng của RAID:</span>
                  <h4 className="text-xl font-bold font-mono text-[var(--ink)] mb-0.5">
                    {storageOutputs.usableTB.toFixed(2)} TB
                  </h4>
                  <p className="text-[10px] text-[var(--body)]">Cấu hình: {storageDiskCount} ổ {storageDiskSize}TB</p>
                </GlassCard>
              </div>

              <div className="p-3 bg-[var(--canvas-soft)] border border-[var(--hairline)] rounded-[var(--radius-card)] text-[10px] text-[var(--mute)]">
                * Lưu ý: RAID chỉ có tác dụng bảo vệ dữ liệu trước sự cố hỏng đĩa vật lý, <strong>không thay thế cho Backup</strong>. Hãy thiết lập kế hoạch backup DB/config/model/evidence riêng biệt.
              </div>
            </div>
          </div>
        )}

        {activeTab === "ups" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Inputs */}
            <div className="space-y-3.5 text-xs">
              <GlassCard className="p-4 border border-[var(--hairline-strong)]" hoverGlow={false}>
                <span className="font-bold text-[var(--ink)] block mb-3 font-mono">Công suất tải tủ Rack</span>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">Công suất AI Server (W)</label>
                    <input
                      type="number"
                      value={upsServerW}
                      onChange={(e) => setUpsServerW(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full h-8 px-2.5 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">Công suất NAS Storage (W)</label>
                    <input
                      type="number"
                      value={upsNasW}
                      onChange={(e) => setUpsNasW(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full h-8 px-2.5 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">Công suất Switch PoE (W)</label>
                    <input
                      type="number"
                      value={upsSwitchW}
                      onChange={(e) => setUpsSwitchW(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full h-8 px-2.5 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">Công suất thiết bị khác (W)</label>
                    <input
                      type="number"
                      value={upsOtherW}
                      onChange={(e) => setUpsOtherW(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full h-8 px-2.5 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-4 border border-[var(--hairline-strong)]" hoverGlow={false}>
                <span className="font-bold text-[var(--ink)] block mb-3 font-mono">Định mức bộ lưu điện UPS</span>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">Công suất UPS đề xuất</label>
                    <select
                      value={upsSizeKva}
                      onChange={(e) => setUpsSizeKva(parseFloat(e.target.value))}
                      className="w-full h-8 px-2 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] font-mono"
                    >
                      <option value="2.0">2.0 kVA (500Wh Pin mặc định)</option>
                      <option value="3.0">3.0 kVA (800Wh Pin mặc định - Khuyên dùng)</option>
                      <option value="5.0">5.0 kVA (1400Wh Pin mặc định)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">Hệ số công suất (PF)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={upsPf}
                      onChange={(e) => setUpsPf(Math.max(0.1, Math.min(1.0, parseFloat(e.target.value) || 0.9)))}
                      className="w-full h-8 px-2.5 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Outputs */}
            <div className="lg:col-span-2 space-y-4">
              <div className={cn(
                "p-4 rounded-[var(--radius-card)] border text-xs font-semibold flex items-center justify-between transition-colors",
                upsOutputs.status === "good"
                  ? "bg-green-500/10 border-green-500/20 text-green-600"
                  : upsOutputs.status === "warning"
                  ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600"
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              )}>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>{upsOutputs.recommendation}</span>
                </div>
                <span className="font-mono text-sm font-bold">
                  {upsOutputs.runtimeMinutes.toFixed(0)} phút lưu điện
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <GlassCard className="p-4 border border-[var(--hairline)]" hoverGlow={false}>
                  <span className="text-[9px] uppercase font-bold text-[var(--mute)] tracking-wider block mb-1">Tổng công suất tải thực tế:</span>
                  <h4 className="text-xl font-bold font-mono text-[var(--ink)] mb-0.5">
                    {upsOutputs.totalLoadW.toFixed(0)} W
                  </h4>
                </GlassCard>

                <GlassCard className="p-4 border border-[var(--hairline)]" hoverGlow={false}>
                  <span className="text-[9px] uppercase font-bold text-[var(--mute)] tracking-wider block mb-1">Công suất cực đại UPS:</span>
                  <h4 className="text-xl font-bold font-mono text-[var(--ink)] mb-0.5">
                    {upsOutputs.upsMaxW.toFixed(0)} W
                  </h4>
                </GlassCard>

                <GlassCard className="p-4 border border-[var(--hairline)]" hoverGlow={false}>
                  <span className="text-[9px] uppercase font-bold text-[var(--mute)] tracking-wider block mb-1">Tỷ lệ tải UPS:</span>
                  <h4 className="text-xl font-bold font-mono text-[var(--ink)] mb-0.5">
                    {upsOutputs.loadPercent.toFixed(1)} %
                  </h4>
                </GlassCard>
              </div>

              <div className="p-3 bg-[var(--canvas-soft)] border border-yellow-500/20 rounded-[var(--radius-card)] text-[10px] text-yellow-600 flex items-start gap-1.5">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                  * Khuyến cáo: Thời gian lưu điện chỉ mang tính chất ước lượng. Thời gian hoạt động thực tế phụ thuộc lớn vào đặc tính kỹ thuật, tuổi thọ ắc quy, nhiệt độ tủ rack và datasheet thực tế của nhà sản xuất.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "poe" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Inputs */}
            <div className="space-y-3.5 text-xs">
              <GlassCard className="p-4 border border-[var(--hairline-strong)]" hoverGlow={false}>
                <span className="font-bold text-[var(--ink)] block mb-3 font-mono">Tải cấp nguồn PoE</span>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">Số lượng camera đầu cuối</label>
                    <input
                      type="number"
                      value={poeCameras}
                      onChange={(e) => setPoeCameras(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full h-8 px-2.5 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">Công suất trung bình/Camera (W)</label>
                    <input
                      type="number"
                      value={poeWattPerCamera}
                      onChange={(e) => setPoeWattPerCamera(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full h-8 px-2.5 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--body)] mb-1">PoE Switch Budget thiết kế (W)</label>
                    <input
                      type="number"
                      value={poeSwitchBudget}
                      onChange={(e) => setPoeSwitchBudget(Math.max(10, parseInt(e.target.value) || 10))}
                      className="w-full h-8 px-2.5 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Outputs */}
            <div className="lg:col-span-2 space-y-4">
              <div className={cn(
                "p-4 rounded-[var(--radius-card)] border text-xs font-semibold flex items-center justify-between transition-colors",
                poeOutputs.isSufficient
                  ? "bg-green-500/10 border-green-500/20 text-green-600"
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              )}>
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  <span>
                    {poeOutputs.isSufficient
                      ? "Switch PoE đủ công suất cấp nguồn cho hệ thống."
                      : "CẢNH BÁO: Công suất yêu cầu vượt quá ngân sách PoE thiết kế của switch!"}
                  </span>
                </div>
                <span className="font-mono text-sm font-bold">
                  {poeOutputs.recommendedPoE.toFixed(0)}W / {poeSwitchBudget}W
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <GlassCard className="p-4 border border-[var(--hairline)]" hoverGlow={false}>
                  <span className="text-[9px] uppercase font-bold text-[var(--mute)] tracking-wider block mb-1">Công suất tải thô camera:</span>
                  <h4 className="text-xl font-bold font-mono text-[var(--ink)] mb-0.5">
                    {poeOutputs.requiredPoE.toFixed(0)} W
                  </h4>
                </GlassCard>

                <GlassCard className="p-4 border border-[var(--hairline)]" hoverGlow={false}>
                  <span className="text-[9px] uppercase font-bold text-[var(--mute)] tracking-wider block mb-1">Khuyến nghị (+25% Headroom):</span>
                  <h4 className="text-xl font-bold font-mono text-[var(--ink)] mb-0.5">
                    {poeOutputs.recommendedPoE.toFixed(0)} W
                  </h4>
                </GlassCard>
              </div>

              <p className="text-[10px] text-[var(--mute)] leading-relaxed italic border-t border-[var(--hairline)] pt-3">
                * Gợi ý: Nếu công suất vượt quá ngân sách cấp nguồn PoE của một switch đơn lẻ, hãy cân nhắc phân tách luồng camera sang switch PoE thứ hai hoặc nâng cấp dòng switch chuyên dụng có tổng công suất PoE cao hơn.
              </p>
            </div>
          </div>
        )}

        {activeTab === "cost" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Inputs Table */}
            <div className="lg:col-span-2 border border-[var(--hairline)] rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface)] p-4 text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--canvas-soft)] border-b border-[var(--hairline)] text-[10px] font-bold font-mono text-[var(--mute)] uppercase">
                    <th className="p-2 w-1/2">Hạng mục thiết bị</th>
                    <th className="p-2 text-center w-1/6">SL</th>
                    <th className="p-2 text-right w-1/3">Đơn giá (Triệu VNĐ)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--hairline)]">
                    <td className="p-2 font-bold text-[var(--ink)]">AI Server (L4 24GB, 2U)</td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={costQtyServer}
                        onChange={(e) => setCostQtyServer(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-12 text-center rounded border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] py-0.5 text-[var(--ink)] font-mono"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        value={costPriceServer}
                        onChange={(e) => setCostPriceServer(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-24 text-right rounded border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] py-0.5 text-[var(--ink)] font-mono pr-1"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--hairline)]">
                    <td className="p-2 font-bold text-[var(--ink)]">Tủ NAS trung tâm (8-bay)</td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={costQtyNas}
                        onChange={(e) => setCostQtyNas(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-12 text-center rounded border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] py-0.5 text-[var(--ink)] font-mono"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        value={costPriceNas}
                        onChange={(e) => setCostPriceNas(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-24 text-right rounded border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] py-0.5 text-[var(--ink)] font-mono pr-1"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--hairline)]">
                    <td className="p-2 font-bold text-[var(--ink)]">HDD Set (Dòng Enterprise)</td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={costQtyHdd}
                        onChange={(e) => setCostQtyHdd(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-12 text-center rounded border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] py-0.5 text-[var(--ink)] font-mono"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        value={costPriceHdd}
                        onChange={(e) => setCostPriceHdd(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-24 text-right rounded border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] py-0.5 text-[var(--ink)] font-mono pr-1"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--hairline)]">
                    <td className="p-2 font-bold text-[var(--ink)]">Thiết bị mạng Managed (Switch, VLAN)</td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={costQtyNet}
                        onChange={(e) => setCostQtyNet(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-12 text-center rounded border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] py-0.5 text-[var(--ink)] font-mono"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        value={costPriceNet}
                        onChange={(e) => setCostPriceNet(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-24 text-right rounded border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] py-0.5 text-[var(--ink)] font-mono pr-1"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--hairline)]">
                    <td className="p-2 font-bold text-[var(--ink)]">Tủ UPS Online 3kVA + Phụ kiện</td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={costQtyUps}
                        onChange={(e) => setCostQtyUps(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-12 text-center rounded border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] py-0.5 text-[var(--ink)] font-mono"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        value={costPriceUps}
                        onChange={(e) => setCostPriceUps(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-24 text-right rounded border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] py-0.5 text-[var(--ink)] font-mono pr-1"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--hairline)]">
                    <td className="p-2 font-bold text-[var(--ink)]">Camera thay mới (Nếu cần audit hỏng)</td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={costQtyReplace}
                        onChange={(e) => setCostQtyReplace(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-12 text-center rounded border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] py-0.5 text-[var(--ink)] font-mono"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        value={costPriceReplace}
                        onChange={(e) => setCostPriceReplace(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-24 text-right rounded border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] py-0.5 text-[var(--ink)] font-mono pr-1"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Cost Display Panel */}
            <div className="flex flex-col gap-4 text-xs">
              <GlassCard className="p-5 border border-[var(--hairline-strong)] flex-1 flex flex-col justify-between" hoverGlow={false}>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--mute)] tracking-wider block mb-1">
                    Tổng chi phí thiết bị dự kiến:
                  </span>
                  <h3 className="text-2xl font-bold font-mono text-[var(--ink)]">
                    {totalCost.toLocaleString()} Triệu VNĐ
                  </h3>
                  <p className="text-[11px] text-[var(--body)] mt-2 leading-relaxed">
                    Dự toán dựa trên số lượng và đơn giá tự chọn ở bảng cấu hình thiết bị bên trái.
                  </p>
                </div>

                <div className="border-t border-[var(--hairline)] pt-3.5 mt-4 text-[10px] text-[var(--mute)] leading-relaxed">
                  ⚠️ <strong>Cảnh báo quan trọng:</strong> Tổng chi phí hiển thị ở trên chỉ mang tính chất ước tính tham khảo để lập ngân sách nội bộ. Hãy lấy báo giá chính thức từ ít nhất 2 - 3 nhà cung cấp thiết bị phần cứng trước khi tiến hành thanh toán hay lập BOM mua sắm.
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  );
};
