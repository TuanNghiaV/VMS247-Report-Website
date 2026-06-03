import React from "react";
import { SectionShell } from "../layout/SectionShell";
import { GlassCard } from "../ui/GlassCard";
import { ClassificationStrip, TechChapterLabel } from "../ui/TechChapter";
import { Cpu, Info } from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

const classification = [
  {
    title: "Core Pilot",
    status: "core" as const,
    items: [
      "DeepStream, GStreamer, NVDEC, nvstreammux, TensorRT/nvinfer, nvtracker, nvdsanalytics cho 18 camera 24/7.",
    ],
  },
  {
    title: "Optional",
    status: "optional" as const,
    items: [
      "Triton hoặc NATS JetStream khi cần tách inference/event service và mở rộng tải.",
    ],
  },
  {
    title: "Prototype / Offline",
    status: "future" as const,
    items: [
      "OpenCV, ONNX Runtime, OpenVINO cho prototype, helper tool, gán nhãn hoặc xử lý offline.",
    ],
  },
];

const pipelineSteps = [
  { name: "Nhận luồng RTSP", tech: "GStreamer", desc: "Nhận stream từ camera VLAN/ONVIF." },
  { name: "Giải mã bằng GPU", tech: "NVDEC", desc: "Decode H.264/H.265 bằng phần cứng." },
  { name: "Gom luồng", tech: "nvstreammux", desc: "Batch nhiều camera để tối ưu GPU." },
  { name: "Suy luận TensorRT", tech: "nvinfer", desc: "Chạy model AI đã tối ưu engine." },
  { name: "Theo dõi đối tượng", tech: "nvtracker", desc: "Gán ID và theo dấu qua frame." },
  { name: "Phân tích ROI/line", tech: "nvdsanalytics", desc: "Kiểm tra zone, line crossing, ROI." },
  { name: "Xuất metadata sự kiện", tech: "JSON", desc: "Đẩy metadata sang Rule Engine." },
];

export const VideoAiPipeline: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  return (
    <SectionShell id="video-ai-pipeline" isActive={isActive}>
      <div className="mb-3">
        <TechChapterLabel index={3} />
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
          Pipeline xử lý video AI bằng GPU
        </h2>
        <p className="mt-1 max-w-4xl text-sm leading-relaxed text-[var(--body)]">
          Luồng xử lý nhiều camera song song bằng NVIDIA DeepStream, GStreamer, NVDEC và TensorRT.
        </p>
      </div>

      <ClassificationStrip
        groups={classification}
        className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-3 [&>div]:p-2.5 [&_p]:text-[10.5px] [&_p]:leading-snug"
      />

      <div
        className="grid flex-1 grid-cols-1 items-start gap-4 overflow-hidden lg:grid-cols-3"
        data-section-nav-ignore="true"
      >
        <div className="lg:col-span-2">
          <GlassCard className="border border-[var(--hairline-strong)] p-4" hoverGlow={false}>
            <div className="mb-3 flex items-center gap-2">
              <Cpu className="h-4.5 w-4.5 text-[var(--ink)]" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--ink)]">
                Quy trình xử lý tuần tự trên GPU
              </h3>
            </div>

            <div className="relative before:absolute before:left-3 before:top-7 before:bottom-8 before:w-px before:bg-[var(--hairline)]">
              {pipelineSteps.map((step, index) => (
                <div key={step.name} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--hairline)] bg-[var(--surface-soft)] text-[9px] font-semibold text-[var(--body)]">
                      {index + 1}
                    </div>
                  </div>

                  <div className="mb-2 min-w-0 flex-1 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="block text-sm font-semibold leading-tight text-[var(--ink)]">
                          {step.name}
                        </span>
                        <p className="mt-0.5 truncate text-xs leading-snug text-[var(--body)]">
                          {step.desc}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--surface-soft)] px-2 py-0.5 font-mono text-[9px] font-medium text-[var(--body)]">
                        {step.tech}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-1 border-t border-[var(--hairline)] pt-2 text-[10.5px] italic leading-snug text-[var(--mute)]">
              * Pipeline GPU tạo metadata gồm camera ID, object ID, timestamp, confidence, ROI/line status. Cảnh báo thật được quyết định ở Rule Engine.
            </div>
          </GlassCard>
        </div>

        <div className="self-start">
          <GlassCard className="h-fit border border-[var(--hairline-strong)] p-4" hoverGlow={false}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--ink)]">
              Ghi chú triển khai
            </h3>
            <div className="space-y-2.5 text-xs leading-snug text-[var(--body)]">
              <p>
                OpenCV/ONNX Runtime phù hợp cho prototype, helper tool hoặc gán nhãn offline. Với pilot 18 camera 24/7, pipeline chính nên ưu tiên DeepStream + TensorRT.
              </p>
              <p>
                Không nhất thiết inference đủ 25-30 FPS/camera. Mức 5-10 FPS/camera thường hợp lý hơn cho giám sát và cảnh báo.
              </p>
              <p>
                Cần theo dõi FPS, dropped frames, độ trễ inference và reconnect RTSP để giữ pipeline ổn định.
              </p>
              <div className="flex gap-2 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface-soft)] p-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--body)]" />
                <p className="text-[11px]">
                  Khuyến nghị Gia Lâm: DeepStream làm pipeline chính, TensorRT cho model, nvtracker cho object ID, nvdsanalytics cho ROI/line, metadata đẩy sang Rule Engine.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </SectionShell>
  );
};
