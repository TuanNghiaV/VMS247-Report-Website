// Section definitions for VMS247 report
export interface SectionInfo {
  id: string;
  title: string;
  shortTitle: string;
  eyebrow?: string;
}

export const SECTIONS: SectionInfo[] = [
  {
    id: "executive-snapshot",
    title: "Nền tảng VMS247 AI Camera",
    shortTitle: "Tóm tắt",
    eyebrow: "EXECUTIVE SNAPSHOT",
  },
  {
    id: "how-it-works",
    title: "Nguyên lý hoạt động",
    shortTitle: "Cách hệ thống hoạt động",
    eyebrow: "NGUYÊN LÝ VẬN HÀNH",
  },
  {
    id: "architecture-overview",
    title: "Tổng quan kiến trúc hệ thống",
    shortTitle: "Kiến trúc tổng quan",
    eyebrow: "KIẾN TRÚC HỆ THỐNG",
  },
  {
    id: "tech-stack-explorer",
    title: "Nghiên cứu công nghệ khả thi",
    shortTitle: "Công nghệ",
    eyebrow: "NGHIÊN CỨU CÔNG NGHỆ",
  },
  {
    id: "data-flow",
    title: "Luồng xử lý dữ liệu chi tiết",
    shortTitle: "Luồng vận hành",
    eyebrow: "LUỒNG XỬ LÝ DỮ LIỆU",
  },
  {
    id: "camera-network-stack",
    title: "Hạ tầng Camera & Mạng nội bộ",
    shortTitle: "Camera & Mạng",
    eyebrow: "CAMERA & NETWORK STACK",
  },
  {
    id: "video-ai-pipeline",
    title: "Pipeline xử lý video AI bằng GPU",
    shortTitle: "Pipeline AI",
    eyebrow: "VIDEO AI PIPELINE",
  },
  {
    id: "ai-modules",
    title: "Lớp mô hình AI theo nghiệp vụ",
    shortTitle: "Model AI",
    eyebrow: "AI MODEL STACK",
  },
  {
    id: "backend-data-stack",
    title: "Backend, Rule Engine & Lưu trữ dữ liệu",
    shortTitle: "Backend & Dữ liệu",
    eyebrow: "BACKEND, EVENT & DATA",
  },
  {
    id: "security-monitoring",
    title: "Bảo mật, giám sát & kiểm soát vận hành",
    shortTitle: "Bảo mật & Giám sát",
    eyebrow: "SECURITY & MONITORING",
  },
  {
    id: "hardware-blueprint",
    title: "Thiết kế hạ tầng & cấu hình khuyến nghị",
    shortTitle: "Phần cứng",
    eyebrow: "HẠ TẦNG PHẦN CỨNG",
  },
  {
    id: "final-recommendation",
    title: "Kết luận & khuyến nghị triển khai pilot",
    shortTitle: "Chi phí & Khuyến nghị",
    eyebrow: "KẾT LUẬN TRIỂN KHAI",
  },
];
