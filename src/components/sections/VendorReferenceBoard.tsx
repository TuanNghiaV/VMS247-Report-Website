import React, { useState } from "react";
import { SectionShell } from "../layout/SectionShell";
import { initialVendorSources } from "../../data/vendorSources";
import { ExternalLink, Edit2, Check, RefreshCw } from "lucide-react";
import { cn } from "../../utils/cn";

interface SectionProps {
  isActive?: boolean;
}

export const VendorReferenceBoard: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  const [sources, setSources] = useState(initialVendorSources);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Inline edit state variables
  const [tempRange, setTempRange] = useState("");
  const [tempName, setTempName] = useState("");
  const [tempUrl, setTempUrl] = useState("");
  const [tempNotes, setTempNotes] = useState("");
  const [tempLastChecked, setTempLastChecked] = useState("");

  const startEdit = (id: string) => {
    const item = sources.find((s) => s.id === id);
    if (item) {
      setEditId(id);
      setTempRange(item.estimatedRange);
      setTempName(item.vendorName);
      setTempUrl(item.vendorUrl);
      setTempNotes(item.notes);
      setTempLastChecked(item.lastChecked);
    }
  };

  const saveEdit = (id: string) => {
    setSources((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              estimatedRange: tempRange,
              vendorName: tempName,
              vendorUrl: tempUrl,
              notes: tempNotes,
              lastChecked: tempLastChecked,
            }
          : s
      )
    );
    setEditId(null);
  };

  const handleReset = () => {
    setSources(initialVendorSources);
    setEditId(null);
  };

  return (
    <SectionShell id="vendor-reference-board" isActive={isActive}>
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] tracking-tight">
          Bảng Tra Cứu Chi Phí & Nhà Cung Cấp
        </h2>
        <p className="text-[var(--body)] text-sm mt-1">
          Bảng tham khảo chéo thông tin giá và nhà cung cấp phần cứng. Bạn có thể nhấn chỉnh sửa trực tiếp thông tin để phục vụ hội ý.
        </p>
      </div>

      <div className="flex justify-end mb-3" data-section-nav-ignore="true">
        <button
          onClick={handleReset}
          className="text-[10px] flex items-center gap-1 font-semibold font-mono text-[var(--body)] hover:text-[var(--ink)] cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" /> Khôi phục dữ liệu gốc
        </button>
      </div>

      {/* Grid wrapper for table */}
      <div
        className="flex-1 overflow-auto border border-[var(--hairline)] rounded-[var(--radius-card)] bg-[var(--surface)] p-3 text-xs"
        data-section-nav-ignore="true"
      >
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[var(--canvas-soft)] border-b border-[var(--hairline)] text-[10px] font-bold font-mono text-[var(--mute)] uppercase">
              <th className="p-2">Hạng mục</th>
              <th className="p-2">Cấu hình khuyến nghị</th>
              <th className="p-2">Dải giá ước tính</th>
              <th className="p-2">Loại nguồn</th>
              <th className="p-2">Nhà cung cấp / URL</th>
              <th className="p-2">Cập nhật cuối</th>
              <th className="p-2 text-center">Độ tin cậy</th>
              <th className="p-2">Ghi chú</th>
              <th className="p-2 text-center">Sửa</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((row) => {
              const isEditing = editId === row.id;
              return (
                <tr key={row.id} className="border-b border-[var(--hairline)] hover:bg-[var(--canvas-soft)]">
                  {/* Component Name */}
                  <td className="p-2 font-bold text-[var(--ink)] font-mono">{row.component}</td>
                  
                  {/* Recommended Spec */}
                  <td className="p-2 text-[var(--body)] max-w-xs">{row.recommendedSpec}</td>
                  
                  {/* Estimated Range */}
                  <td className="p-2 font-mono">
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempRange}
                        onChange={(e) => setTempRange(e.target.value)}
                        className="w-full px-1 py-0.5 border border-[var(--hairline-strong)] bg-[var(--canvas)] text-[var(--ink)] font-mono text-xs rounded"
                      />
                    ) : (
                      row.estimatedRange
                    )}
                  </td>
                  
                  {/* Source Type */}
                  <td className="p-2 text-[var(--mute)] font-mono text-[10px]">{row.sourceType}</td>
                  
                  {/* Vendor & URL */}
                  <td className="p-2 font-mono text-[11px]">
                    {isEditing ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          placeholder="Vendor Name"
                          className="w-full px-1 py-0.5 border border-[var(--hairline-strong)] bg-[var(--canvas)] text-[var(--ink)] text-[10px] rounded"
                        />
                        <input
                          type="text"
                          value={tempUrl}
                          onChange={(e) => setTempUrl(e.target.value)}
                          placeholder="Vendor URL"
                          className="w-full px-1 py-0.5 border border-[var(--hairline-strong)] bg-[var(--canvas)] text-[var(--ink)] text-[10px] rounded"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span>{row.vendorName}</span>
                        {row.vendorUrl && row.vendorUrl !== "#" && (
                          <a
                            href={row.vendorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--primary)] hover:opacity-75"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </td>
                  
                  {/* Last Checked */}
                  <td className="p-2 text-[var(--body)] font-mono text-[10px]">
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempLastChecked}
                        onChange={(e) => setTempLastChecked(e.target.value)}
                        className="w-20 px-1 py-0.5 border border-[var(--hairline-strong)] bg-[var(--canvas)] text-[var(--ink)] font-mono text-[10px] rounded"
                      />
                    ) : (
                      row.lastChecked
                    )}
                  </td>
                  
                  {/* Confidence */}
                  <td className="p-2 text-center font-mono">
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded-[var(--radius-pill)] text-[9px] font-bold border",
                        row.confidence === "High"
                          ? "bg-green-500/10 border-green-500/20 text-green-600"
                          : row.confidence === "Medium"
                          ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600"
                          : "bg-red-500/10 border-red-500/20 text-red-500"
                      )}
                    >
                      {row.confidence}
                    </span>
                  </td>
                  
                  {/* Notes */}
                  <td className="p-2 text-[var(--body)] max-w-[200px]">
                    {isEditing ? (
                      <textarea
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        className="w-full px-1 py-0.5 border border-[var(--hairline-strong)] bg-[var(--canvas)] text-[var(--ink)] text-xs rounded"
                      />
                    ) : (
                      row.notes
                    )}
                  </td>
                  
                  {/* Edit action */}
                  <td className="p-2 text-center">
                    {isEditing ? (
                      <button
                        onClick={() => saveEdit(row.id)}
                        className="p-1 text-green-600 hover:opacity-75 cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(row.id)}
                        className="p-1 text-[var(--body)] hover:text-[var(--ink)] cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 p-3 bg-[var(--canvas-soft)] border border-[var(--hairline)] rounded-[var(--radius-card)] text-[10px] text-[var(--mute)] text-center">
        ⚠️ <strong>Tuyên bố từ chối trách nhiệm:</strong> Bảng giá trị trên chỉ mang tính tham khảo kỹ thuật để lập dự toán kế hoạch. Trước khi tiến hành thanh toán hay đặt hàng chính thức, bắt buộc phải lấy báo giá từ ít nhất 2 - 3 nhà cung cấp hoặc đối tác ủy quyền của hãng.
      </div>
    </SectionShell>
  );
};
