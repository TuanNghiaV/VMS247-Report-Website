// Section definitions for VMS247 report
export interface SectionInfo {
  id: string;
  title: string;
  shortTitle: string;
}

export const SECTIONS: SectionInfo[] = [
  { id: "executive-snapshot", title: "Executive Snapshot", shortTitle: "Tóm tắt" },
  { id: "how-it-works", title: "How VMS247 Works", shortTitle: "Cách hệ thống hoạt động" },
  { id: "architecture-overview", title: "System Architecture Overview", shortTitle: "Kiến trúc tổng quan" },
  { id: "tech-stack-explorer", title: "Nghiên cứu công nghệ khả thi", shortTitle: "Công nghệ" },
  { id: "data-flow", title: "Detailed Operational Flow with Tech Mapping", shortTitle: "Luồng vận hành" },
  { id: "camera-network-stack", title: "Hạ tầng Camera & Mạng nội bộ", shortTitle: "Camera & Mạng" },
  { id: "video-ai-pipeline", title: "Pipeline xử lý video AI bằng GPU", shortTitle: "Pipeline AI" },
  { id: "ai-modules", title: "Lớp mô hình AI theo nghiệp vụ", shortTitle: "Model AI" },
  { id: "backend-data-stack", title: "Backend, Rule Engine & Lưu trữ dữ liệu", shortTitle: "Backend & Dữ liệu" },
  { id: "security-monitoring", title: "Bảo mật, giám sát & kiểm soát vận hành", shortTitle: "Bảo mật & Giám sát" },
  { id: "hardware-blueprint", title: "Thiết kế phần cứng đề xuất", shortTitle: "Phần cứng" },
  { id: "final-recommendation", title: "Ước tính chi phí & Khuyến nghị cuối", shortTitle: "Chi phí & Khuyến nghị" },
];
