import React, { useEffect, useState } from "react";
import { FlowArrow } from "../ui/FlowArrow";
import { SectionShell } from "../layout/SectionShell";
import { TechChapterLabel } from "../ui/TechChapter";
import { flowNodes } from "../../data/flowNodes";
import { cn } from "../../utils/cn";

interface SectionProps {
  isActive?: boolean;
}

type FlowNode = (typeof flowNodes)[number];
type LaneKey = FlowNode["lane"];
type Direction = "right" | "left" | "down";
type LaneGridItem =
  | { type: "node"; id: number; row: number; col: number }
  | { type: "arrow"; direction: Direction; row: number; col: number; activeAfter: number }
  | { type: "empty"; row: number; col: number };

type LaneConfig = {
  key: LaneKey;
  title: string;
  subtitle: string;
  gridRows: number;
  items: LaneGridItem[];
  handoffLabel?: string;
  handoffTargetNodeId?: number;
};

const laneConfigs: LaneConfig[] = [
  {
    key: "Video Data Plane",
    title: "Tầng xử lý video AI",
    subtitle: "Luồng dữ liệu video",
    gridRows: 3,
    items: [
      { type: "node", id: 1, row: 1, col: 1 },
      { type: "arrow", direction: "right", row: 1, col: 2, activeAfter: 1 },
      { type: "node", id: 2, row: 1, col: 3 },
      { type: "arrow", direction: "right", row: 1, col: 4, activeAfter: 2 },
      { type: "node", id: 3, row: 1, col: 5 },
      { type: "arrow", direction: "down", row: 2, col: 5, activeAfter: 3 },
      { type: "node", id: 6, row: 3, col: 1 },
      { type: "arrow", direction: "left", row: 3, col: 2, activeAfter: 5 },
      { type: "node", id: 5, row: 3, col: 3 },
      { type: "arrow", direction: "left", row: 3, col: 4, activeAfter: 4 },
      { type: "node", id: 4, row: 3, col: 5 },
    ],
    handoffLabel: "Kết quả AI / metadata",
    handoffTargetNodeId: 7,
  },
  {
    key: "Event & Business Plane",
    title: "Tầng sự kiện & nghiệp vụ",
    subtitle: "Event & Business Plane",
    gridRows: 3,
    items: [
      { type: "node", id: 7, row: 1, col: 1 },
      { type: "arrow", direction: "right", row: 1, col: 2, activeAfter: 7 },
      { type: "node", id: 8, row: 1, col: 3 },
      { type: "arrow", direction: "right", row: 1, col: 4, activeAfter: 8 },
      { type: "node", id: 9, row: 1, col: 5 },
      { type: "arrow", direction: "down", row: 2, col: 5, activeAfter: 9 },
      { type: "empty", row: 3, col: 1 },
      { type: "empty", row: 3, col: 2 },
      { type: "node", id: 11, row: 3, col: 3 },
      { type: "arrow", direction: "left", row: 3, col: 4, activeAfter: 10 },
      { type: "node", id: 10, row: 3, col: 5 },
    ],
    handoffLabel: "Event + bằng chứng",
    handoffTargetNodeId: 12,
  },
  {
    key: "Storage & Evidence Plane",
    title: "Tầng lưu trữ & bằng chứng",
    subtitle: "Lưu trữ & bằng chứng",
    gridRows: 1,
    items: [
      { type: "node", id: 12, row: 1, col: 1 },
      { type: "arrow", direction: "right", row: 1, col: 2, activeAfter: 12 },
      { type: "node", id: 13, row: 1, col: 3 },
      { type: "arrow", direction: "right", row: 1, col: 4, activeAfter: 13 },
      { type: "node", id: 14, row: 1, col: 5 },
    ],
  },
];

const laneHeightClass: Record<LaneKey, string> = {
  "Video Data Plane": "h-[198px]",
  "Event & Business Plane": "h-[198px]",
  "Storage & Evidence Plane": "h-[108px]",
};

const stationLabelMap: Record<number, string> = {
  1: "Camera",
  2: "Nhận luồng",
  3: "Giải mã",
  4: "Gom luồng",
  5: "AI nhận diện",
  6: "Tracking/ROI",
  7: "Kiểm tra rule",
  8: "Tạo sự kiện",
  9: "Lưu lịch sử",
  10: "Gửi cảnh báo",
  11: "Dashboard",
  12: "Lưu video",
  13: "Lưu bằng chứng",
  14: "Sao lưu",
};

const stationTechMap: Record<number, string> = {
  1: "IP Camera / RTSP",
  2: "RTSP / ONVIF",
  3: "NVDEC",
  4: "DeepStream",
  5: "TensorRT / YOLO",
  6: "nvtracker / ROI",
  7: "Rule Engine",
  8: "Event Service",
  9: "PostgreSQL",
  10: "Zalo / SMS / Email",
  11: "API / PWA",
  12: "NAS / RAID 6",
  13: "MinIO",
  14: "Chính sách sao lưu",
};

const detailHeadingOverride: Record<number, { displayTitle: string; technicalTitle: string }> = {
  5: {
    displayTitle: "AI nhận diện đối tượng",
    technicalTitle: "TensorRT Inference / YOLO",
  },
};

const nodeById = Object.fromEntries(flowNodes.map((node) => [node.id, node])) as Record<number, FlowNode>;


function FlowNodeCard({
  nodeId,
  nodeActive,
  onSelect,
}: {
  nodeId: number;
  nodeActive: boolean;
  onSelect: (nodeId: number) => void;
}) {
  const node = nodeById[nodeId];

  return (
    <button
      type="button"
      onClick={() => onSelect(nodeId)}
      className={cn(
        "relative flex min-h-[64px] w-[156px] flex-col rounded-[var(--radius-card)] border px-3 py-2.5 text-left text-[var(--ink)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] xl:w-[168px]",
        nodeActive
          ? "border-[var(--ink)]/40 bg-[var(--surface)] shadow-[0_12px_28px_rgba(15,23,42,0.10)] ring-2 ring-[var(--hairline-strong)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
          : "border-[var(--hairline)] bg-[var(--surface)] hover:-translate-y-0.5 hover:border-[var(--body)] hover:shadow-sm"
      )}
      aria-pressed={nodeActive}
    >
      {nodeActive ? (
        <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-[var(--ink)]/45" />
      ) : null}
      <div className="flex items-start gap-2">
        <span
          className={cn(
            "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] font-semibold transition-colors",
            nodeActive
              ? "border-[var(--ink)]/35 bg-[var(--surface-soft)] text-[var(--ink)]"
              : "border-[var(--hairline)] bg-[var(--surface-soft)] text-[var(--body)]"
          )}
        >
          {nodeId}
        </span>
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold leading-4">
            {stationLabelMap[nodeId] || node.displayTitle}
          </div>
          <div className="mt-0.5 truncate font-mono text-[9px] leading-3 text-[var(--mute)]">
            {stationTechMap[nodeId] || node.technicalTitle}
          </div>
        </div>
      </div>
    </button>
  );
}

function ArrowCell({
  direction,
  active,
}: {
  direction: Direction;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-[64px] w-[42px] items-center justify-center rounded-full transition-colors xl:w-12",
        active ? "bg-[var(--surface-soft)] text-[var(--ink)]" : "text-[var(--body)]"
      )}
    >
      <FlowArrow
        direction={direction === "down" ? "down" : "right"}
        active={active}
        className={cn(
          "pointer-events-none",
          direction === "left" && "rotate-180",
          direction === "down" ? "h-7 w-5" : "h-6 w-9"
        )}
      />
    </div>
  );
}

function FlowLane({
  lane,
  selectedNodeId,
  onSelect,
}: {
  lane: LaneConfig;
  selectedNodeId: number;
  onSelect: (nodeId: number) => void;
}) {
  return (
    <section className={cn("flex min-h-0 shrink-0 flex-col gap-2 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] px-4 py-3", laneHeightClass[lane.key])}>
      <div className="flex items-baseline justify-between gap-3 border-b border-[var(--hairline)] pb-2">
        <h3 className="text-sm font-semibold text-[var(--ink)] md:text-[15px]">{lane.title}</h3>
        <p className="font-mono text-[10px] text-[var(--mute)] md:text-[11px]">{lane.subtitle}</p>
      </div>

      <div className="min-h-0 flex-1">
        <div
          className="mx-auto grid h-full w-fit grid-cols-[156px_42px_156px_42px_156px] content-center items-center justify-center gap-y-1.5 xl:grid-cols-[168px_48px_168px_48px_168px]"
          style={{ gridTemplateRows: `repeat(${lane.gridRows}, minmax(34px, auto))` }}
        >
          {lane.items.map((entry, index) => {
            if (entry.type === "empty") {
              return <div key={`${lane.key}-empty-${index}`} style={{ gridRow: entry.row, gridColumn: entry.col }} />;
            }

            if (entry.type === "arrow") {
              return (
                <div key={`${lane.key}-arrow-${index}`} style={{ gridRow: entry.row, gridColumn: entry.col }}>
                  <ArrowCell direction={entry.direction} active={selectedNodeId > entry.activeAfter} />
                </div>
              );
            }

            return (
              <div key={entry.id} style={{ gridRow: entry.row, gridColumn: entry.col }}>
                <FlowNodeCard
                  nodeId={entry.id}
                  nodeActive={selectedNodeId === entry.id}
                  onSelect={onSelect}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HandoffConnector({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex h-6 shrink-0 items-center justify-center gap-2">
      <div
        className={cn(
          "whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-medium tracking-wide transition-colors",
          active
            ? "border-[var(--hairline-strong)] bg-[var(--surface)] text-[var(--ink)]"
            : "border-[var(--hairline)] bg-[var(--surface-soft)] text-[var(--mute)]"
        )}
      >
        {label}
      </div>
      <FlowArrow direction="down" active={active} className="h-4 w-3.5 shrink-0" />
    </div>
  );
}

export const DetailedOperationalFlow: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const selectedNode = nodeById[selectedNodeId] || flowNodes[0];

  const selectedLaneTitle =
    selectedNode.lane === "Video Data Plane"
      ? "Tầng xử lý video AI"
      : selectedNode.lane === "Event & Business Plane"
        ? "Tầng sự kiện & nghiệp vụ"
        : "Tầng lưu trữ & bằng chứng";

  const detailTitle = detailHeadingOverride[selectedNode.id]?.displayTitle || selectedNode.displayTitle;
  const detailTechTitle =
    detailHeadingOverride[selectedNode.id]?.technicalTitle || selectedNode.technicalTitle;

  return (
    <SectionShell
      id="data-flow"
      isActive={isActive}
      className="px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10"
      contentClassName="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-[1280px] flex-col justify-start"
    >
      <div className="mb-2 max-w-5xl md:mb-3">
        <TechChapterLabel label="LUỒNG XỬ LÝ DỮ LIỆU" />
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
          Luồng xử lý dữ liệu chi tiết
        </h2>
        <p className="mt-1 max-w-4xl text-xs leading-relaxed text-[var(--body)] md:text-[13px]">
          Camera chỉ truyền hình ảnh thô. AI Server tại nhà máy sẽ nhận luồng video, phân tích bằng AI, kiểm tra điều kiện cảnh báo, sau đó lưu bằng chứng và gửi cảnh báo cho người vận hành.
        </p>
      </div>

      {isMobile ? (
        <div className="flex-1 overflow-visible space-y-4 mt-2" data-section-nav-ignore="true">
          {laneConfigs.map((lane) => {
            const laneNodes = lane.items.filter((item) => item.type === "node");
            return (
              <div key={lane.key} className="bg-[var(--surface-soft)] p-3.5 rounded-[var(--radius-card)] border border-[var(--hairline)]">
                <div className="mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">{lane.title}</h3>
                  <p className="text-[10px] text-[var(--body)] mt-0.5">{lane.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {laneNodes.map((item) => {
                    const node = nodeById[item.id];
                    const isNodeActive = selectedNodeId === item.id;
                    return (
                      <React.Fragment key={item.id}>
                        <button
                          onClick={() => setSelectedNodeId(item.id)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-[var(--radius-card)] border text-left transition-all",
                            isNodeActive
                              ? "border-[var(--ink)] bg-[var(--surface)] ring-2 ring-[var(--ink)]/15 shadow-sm"
                              : "border-[var(--hairline)] bg-[var(--surface)] hover:border-[var(--body)]"
                          )}
                        >
                          <span className={cn(
                            "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-semibold transition-colors",
                            isNodeActive
                              ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-text)]"
                              : "border-[var(--hairline)] bg-[var(--surface-soft)] text-[var(--mute)]"
                          )}>
                            {item.id}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-[var(--ink)] leading-tight">
                              {stationLabelMap[item.id] || node.displayTitle}
                            </h4>
                            <p className="text-[10px] text-[var(--body)] mt-0.5 font-mono truncate">
                              {stationTechMap[item.id] || node.technicalTitle}
                            </p>
                          </div>
                        </button>

                        {isNodeActive && (
                          <div className="border border-[var(--hairline)] bg-[var(--surface)] p-3.5 rounded-[var(--radius-card)] space-y-3.5 my-1.5 shadow-xs">
                            <div className="border-b border-[var(--hairline)] pb-2.5">
                              <div className="mb-1.5 inline-flex rounded-full border border-[var(--hairline)] bg-[var(--surface-soft)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--mute)]">
                                {selectedLaneTitle}
                              </div>
                              <h5 className="text-xs font-bold text-[var(--ink)]">Bước {item.id}: {detailTitle}</h5>
                              <p className="font-mono text-[9px] text-[var(--body)] mt-0.5">{detailTechTitle}</p>
                            </div>
                            <div className="space-y-3 text-xs">
                              <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--mute)]">Mục tiêu</span>
                                <p className="text-xs text-[var(--ink)] mt-0.5 font-medium leading-normal">{node.simpleDescription}</p>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface-soft)] p-2">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--mute)]">Đầu vào</span>
                                  <p className="text-[11px] text-[var(--body)] mt-0.5 leading-snug">{node.input}</p>
                                </div>
                                <div className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface-soft)] p-2">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--mute)]">Đầu ra</span>
                                  <p className="text-[11px] text-[var(--body)] mt-0.5 leading-snug">{node.output}</p>
                                </div>
                              </div>
                              <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--mute)]">Xử lý chính</span>
                                <p className="text-xs text-[var(--ink)] mt-0.5 font-medium leading-normal">{node.process}</p>
                              </div>
                              <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--mute)]">Điểm cần kiểm tra</span>
                                <p className="text-xs text-[var(--ink)] mt-0.5 font-medium leading-normal">{node.riskNote}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid h-[calc(100svh-170px)] min-h-0 grid-cols-1 gap-4 overflow-hidden xl:grid-cols-[760px_400px] xl:justify-center xl:gap-6 2xl:grid-cols-[800px_440px]">
          <div className="flex h-full min-h-0 flex-col gap-1 overflow-hidden xl:w-[760px] 2xl:w-[800px]">
            {laneConfigs.map((lane, index) => (
              <React.Fragment key={lane.key}>
                <FlowLane
                  lane={lane}
                  selectedNodeId={selectedNodeId}
                  onSelect={setSelectedNodeId}
                />
                {index < laneConfigs.length - 1 && lane.handoffLabel ? (
                  <HandoffConnector
                    label={lane.handoffLabel}
                    active={selectedNodeId >= (lane.handoffTargetNodeId ?? Number.MAX_SAFE_INTEGER)}
                  />
                ) : null}
              </React.Fragment>
            ))}
          </div>

          <aside
            className="h-full min-h-0 rounded-[var(--radius-card)] border border-[var(--hairline-strong)] bg-[var(--surface-soft)] p-4 flex flex-col justify-between"
          >
            <div className="flex h-full min-h-0 flex-col">
              <div className="mb-3 border-b border-[var(--hairline)] pb-3">
                <div className="mb-2 inline-flex rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--surface)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--mute)]">
                  {selectedLaneTitle}
                </div>
                <h3 className="text-sm font-bold text-[var(--ink)] md:text-base">
                  Bước {selectedNode.id}: {detailTitle}
                </h3>
                <p className="font-mono text-[10px] text-[var(--body)] font-medium mt-0.5">{detailTechTitle}</p>
              </div>

              <div className="flex-1 flex flex-col gap-2 mt-3 min-h-0 justify-start overflow-hidden">
                {/* Mục tiêu */}
                <div className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] p-2.5">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--mute)] mb-0.5">Mục tiêu</div>
                  <p className="text-xs leading-normal text-[var(--ink)] font-medium">{selectedNode.simpleDescription}</p>
                </div>

                {/* Đầu vào / Đầu ra Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] p-2.5">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--mute)] mb-0.5">Đầu vào</div>
                    <p className="text-[11px] leading-snug text-[var(--body)] font-medium">{selectedNode.input}</p>
                  </div>
                  <div className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] p-2.5">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--mute)] mb-0.5">Đầu ra</div>
                    <p className="text-[11px] leading-snug text-[var(--body)] font-medium">{selectedNode.output}</p>
                  </div>
                </div>

                {/* Xử lý chính */}
                <div className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] p-2.5">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--mute)] mb-0.5">Xử lý chính</div>
                  <p className="text-xs leading-normal text-[var(--ink)] font-medium">{selectedNode.process}</p>
                </div>

                {/* Điểm cần kiểm tra */}
                <div className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] p-2.5">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--mute)] mb-0.5">Điểm cần kiểm tra</div>
                  <p className="text-xs leading-normal text-[var(--ink)] font-medium">{selectedNode.riskNote}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </SectionShell>
  );
};
