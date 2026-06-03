import React, { useMemo, useState } from "react";
import { calculatePoe } from "../../utils/poeCalculator";
import { calculateUps } from "../../utils/upsCalculator";
import { cn } from "../../utils/cn";
import { Info, Zap, AlertTriangle, RefreshCw } from "lucide-react";

interface UpsPoeCalculatorFormProps {
  onClose?: () => void;
}

export const UpsPoeCalculatorForm: React.FC<UpsPoeCalculatorFormProps> = () => {
  const [cameraCount, setCameraCount] = useState(18);
  const [wattPerCamera, setWattPerCamera] = useState(8);
  const [poeBudget, setPoeBudget] = useState(250);
  const [serverW, setServerW] = useState(350);
  const [nasW, setNasW] = useState(120);
  const [switchW, setSwitchW] = useState(30);
  const [upsKva, setUpsKva] = useState(3);
  const [powerFactor, setPowerFactor] = useState(0.9);
  const [batteryWh, setBatteryWh] = useState(800);

  const poe = useMemo(() => {
    return calculatePoe({
      cameraCount,
      wattPerCamera,
      poeSwitchBudgetW: poeBudget,
      headroomPercent: 25,
    });
  }, [cameraCount, wattPerCamera, poeBudget]);

  const ups = useMemo(() => {
    return calculateUps({
      serverLoadW: serverW,
      nasLoadW: nasW,
      switchLoadW: switchW,
      otherLoadW: poe.requiredPoE,
      upsSizeKVA: upsKva,
      powerFactor,
      batteryWhInput: batteryWh,
    });
  }, [serverW, nasW, switchW, poe.requiredPoE, upsKva, powerFactor, batteryWh]);

  const overallStatus = poe.status === "green" && ups.status === "green"
    ? "green"
    : poe.status === "red" || ups.status === "red"
      ? "red"
      : "amber";

  const handleReset = () => {
    setCameraCount(18);
    setWattPerCamera(8);
    setPoeBudget(250);
    setServerW(350);
    setNasW(120);
    setSwitchW(30);
    setUpsKva(3);
    setPowerFactor(0.9);
    setBatteryWh(800);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[var(--body)]" data-section-nav-ignore="true">
      {/* Inputs Column */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2">
          <span className="font-bold text-[var(--ink)] font-mono uppercase text-[10px]">Thông số thiết bị</span>
          <button
            type="button"
            onClick={handleReset}
            className="text-[10px] flex items-center gap-1 font-mono text-[var(--body)] hover:text-[var(--ink)] cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" /> Đặt lại
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-0.5">Số camera</label>
            <input
              type="number"
              value={cameraCount}
              min={1}
              onChange={(e) => setCameraCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-center text-[var(--ink)] font-mono focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-0.5">W/camera</label>
            <input
              type="number"
              value={wattPerCamera}
              min={1}
              onChange={(e) => setWattPerCamera(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-center text-[var(--ink)] font-mono focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-0.5">PoE Switch (W)</label>
            <input
              type="number"
              value={poeBudget}
              min={10}
              onChange={(e) => setPoeBudget(Math.max(10, parseInt(e.target.value) || 10))}
              className="h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-center text-[var(--ink)] font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-0.5">Tải Server (W)</label>
            <input
              type="number"
              value={serverW}
              min={0}
              onChange={(e) => setServerW(Math.max(0, parseInt(e.target.value) || 0))}
              className="h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-center text-[var(--ink)] font-mono focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-0.5">Tải NAS (W)</label>
            <input
              type="number"
              value={nasW}
              min={0}
              onChange={(e) => setNasW(Math.max(0, parseInt(e.target.value) || 0))}
              className="h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-center text-[var(--ink)] font-mono focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-0.5">Tải Switch (W)</label>
            <input
              type="number"
              value={switchW}
              min={0}
              onChange={(e) => setSwitchW(Math.max(0, parseInt(e.target.value) || 0))}
              className="h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-center text-[var(--ink)] font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-0.5">UPS kVA</label>
            <input
              type="number"
              value={upsKva}
              min={1}
              step={0.5}
              onChange={(e) => setUpsKva(Math.max(1, parseFloat(e.target.value) || 1))}
              className="h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-center text-[var(--ink)] font-mono focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-0.5">Power Factor</label>
            <input
              type="number"
              value={powerFactor}
              min={0.1}
              step={0.1}
              onChange={(e) => setPowerFactor(Math.max(0.1, parseFloat(e.target.value) || 0.9))}
              className="h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-center text-[var(--ink)] font-mono focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-0.5">Pin UPS (Wh)</label>
            <input
              type="number"
              value={batteryWh}
              min={10}
              onChange={(e) => setBatteryWh(Math.max(10, parseInt(e.target.value) || 10))}
              className="h-8 w-full rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-center text-[var(--ink)] font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Outputs Column */}
      <div className="space-y-4 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2">
            <span className="font-bold text-[var(--ink)] font-mono uppercase text-[10px]">Kết quả tải & UPS</span>
          </div>

          <div className={cn(
            "p-3 rounded-lg border flex items-center justify-between font-mono",
            overallStatus === "green"
              ? "bg-green-500/10 border-green-500/20 text-green-600"
              : overallStatus === "red"
                ? "bg-red-500/10 border-red-500/20 text-red-500"
                : "bg-yellow-500/10 border-yellow-500/20 text-yellow-600"
          )}>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              <span className="font-semibold">
                {overallStatus === "green" ? "Tải an toàn" : "Cần kiểm tra lại"}
              </span>
            </div>
            <span className="font-bold text-sm">
              Tải: {ups.loadPercent.toFixed(0)}% / {ups.estimatedRuntimeMinutes.toFixed(0)} phút pin
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="border border-[var(--hairline)] rounded-lg p-2.5 bg-[var(--canvas-soft)]">
              <span className="block text-[9px] font-bold text-[var(--mute)] uppercase">Tải PoE Switch</span>
              <span className="text-xs font-bold font-mono text-[var(--ink)]">{poe.requiredPoE.toFixed(0)}W / Khuyên dùng {poe.recommendedPoE.toFixed(0)}W</span>
            </div>
            <div className="border border-[var(--hairline)] rounded-lg p-2.5 bg-[var(--canvas-soft)]">
              <span className="block text-[9px] font-bold text-[var(--mute)] uppercase">UPS Max Output</span>
              <span className="text-xs font-bold font-mono text-[var(--ink)]">{ups.upsMaxW.toFixed(0)}W (Tổng tải thực tế: {ups.totalLoadW.toFixed(0)}W)</span>
            </div>
          </div>

          <div className="p-3 bg-[var(--canvas-soft)] border border-[var(--hairline)] rounded-lg flex items-start gap-1.5">
            <Info className="h-4 w-4 text-[var(--mute)] shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed text-[var(--body)]">
              {ups.recommendation}
              <br />
              <span className="text-[9px] text-[var(--mute)] font-normal">{poe.suggestion}</span>
            </p>
          </div>
        </div>

        <div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg flex items-start gap-1.5 mt-auto">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed text-amber-600 font-medium">
            <strong>Lưu ý bắt buộc:</strong> Runtime chỉ là ước tính. Cần kiểm tra datasheet UPS thật, loại battery pack, hiệu suất tải và điều kiện môi trường trước khi mua sắm.
          </p>
        </div>
      </div>
    </div>
  );
};
