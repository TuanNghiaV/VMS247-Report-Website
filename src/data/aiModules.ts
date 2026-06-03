import type { AiModule } from '../types';

export const aiModules: AiModule[] = [
  {
    id: 1,
    title: 'Xâm nhập vùng cấm',
    shortTitle: 'Xâm nhập',
    subtitle: 'Person/vehicle + ROI',
    description: 'Phát hiện người hoặc phương tiện đi vào vùng cấm, khu vực nguy hiểm hoặc khu vực chỉ cho phép người có thẩm quyền.',
    flow: ["Person/Vehicle Detect", "Tracking", "ROI/Line Crossing", "Rule Engine", "Intrusion Event"],
    detectionGoal: 'Nhận diện người, xe máy, ô tô, xe nâng đi qua ranh giới ảo hoặc bước vào vùng cấm.',
    eventOutput: 'Lưu snapshot đối tượng, clip sự kiện trước/sau 5s và metadata tọa độ.',
    coreStack: [
      { name: 'YOLO11s/m hoặc YOLO26s/m', role: 'Phát hiện đối tượng (Người/Phương tiện)' },
      { name: 'nvtracker', role: 'Theo dõi hành trình liên tục (Object Tracking)' },
      { name: 'nvdsanalytics', role: 'Xác định vùng ROI polygon & Line crossing' },
      { name: 'Intrusion Event', role: 'Kích hoạt cảnh báo thời gian thực' }
    ],
    whyChoose: [
      'YOLO11/26 tối ưu TensorRT cực tốt, mang lại throughput lớn trên card L4.',
      'nvtracker và nvdsanalytics chạy native trên GPU giúp giảm tải CPU tối đa cho AI Server.'
    ],
    benchmarkNotes: [
      'Cần đo đạc FPS suy luận thực tế khi chạy full tải 18 camera tại Gia Lâm.',
      'Cần tinh chỉnh tham số tracking để tránh đứt gãy luồng khi bị vật cản che khuất.'
    ],
    optionalBenchmarks: [
      { name: 'RT-DETR-R18/R34', when: 'Khi đối tượng ở quá xa hoặc bị che khuất một phần.', reason: 'Kiến trúc Transformer loại bỏ NMS giúp nhận diện rìa và khoảng cách tốt hơn.' },
      { name: 'D-FINE-S/M', when: 'Khi cần độ chính xác bounding box tối đa.', reason: 'Cải tiến độ trễ và độ chính xác box regression so với RT-DETR.' }
    ],
    futureResearch: [
      { name: 'Grounding DINO', reason: 'Hỗ trợ gán nhãn tự động offline bằng ngôn ngữ tự nhiên khi cấu hình góc camera mới.' }
    ],
    warning: 'Cần benchmark theo góc camera, ánh sáng, khoảng cách và vật cản thực tế tại Gia Lâm để giảm cảnh báo sai.',
    note: 'Module lõi quan trọng nhất của đợt triển khai pilot, trực tiếp bảo đảm an ninh vòng ngoài nhà máy.'
  },
  {
    id: 2,
    title: 'Phát hiện cháy/khói',
    shortTitle: 'Cháy/khói',
    subtitle: 'Smoke/fire debounce',
    description: 'Phát hiện sớm dấu hiệu khói hoặc lửa trên camera giám sát để bổ trợ cảnh báo sớm, không thay thế PCCC chuyên dụng.',
    flow: ["Smoke/Fire Detect", "Multi-frame Debounce", "Confirm Event", "Alert"],
    detectionGoal: 'Phát hiện các điểm phát nhiệt, khói mỏng hoặc đốm lửa bùng phát trong nhà xưởng, kho bãi.',
    eventOutput: 'Snapshot ảnh khoanh vùng khói/lửa, clip sự kiện và cảnh báo khẩn cấp tức thời.',
    coreStack: [
      { name: 'YOLO11s/m-fire/smoke hoặc YOLO26s/m-fire/smoke', role: 'Nhận diện khói và lửa trực tiếp từ video' },
      { name: 'Debounce 2–3s', role: 'Xác nhận liên tục nhiều frame tránh báo giả' },
      { name: 'Confirm Event', role: 'Rule Engine xác thực trạng thái sự kiện' },
      { name: 'Alert', role: 'Notification Gateway gửi cảnh báo khẩn cấp' }
    ],
    whyChoose: [
      'Dễ fine-tune với tập dữ liệu cháy khói đặc thù của nhà máy.',
      'Bộ lọc thời gian (debounce 2-3s) giúp triệt tiêu báo động giả do bụi mịn, hơi nước hoặc ánh sáng phản chiếu.'
    ],
    benchmarkNotes: [
      'Bắt buộc kiểm thử thực tế với lửa staged test trong môi trường giả lập.',
      'Tránh lắp camera ở vị trí có nhiều hơi nước hoặc luồng khí nóng trực diện.'
    ],
    optionalBenchmarks: [
      { name: 'RT-DETR-R18/R34', when: 'Khi khói mỏng ở khoảng cách xa khó nhận biết.', reason: 'Khả năng học đặc trưng toàn cục giúp phát hiện sự thay đổi cấu trúc khói tốt hơn.' },
      { name: 'D-FINE-S/M', when: 'Khi cần độ nhạy cực cao ở rìa khung hình.', reason: 'Tối ưu hóa khả năng hồi quy biên giới hạn các đốm lửa nhỏ.' }
    ],
    futureResearch: [
      { name: 'Thermal camera / fusion', reason: 'Tích hợp camera nhiệt kết hợp cảm biến khói cho các kho hóa chất hoặc khu vực rủi ro cao.' }
    ],
    warning: 'AI chỉ hỗ trợ cảnh báo sớm, không thay thế hệ thống PCCC chuyên dụng. Cần xác nhận nhiều frame và có quy trình xử lý sự cố riêng.',
    note: 'Yêu cầu môi trường thông thoáng, tránh lắp gần nồi hơi, máy hàn hoặc nơi có hơi nước dày đặc.'
  },
  {
    id: 3,
    title: 'PPE / Bảo hộ lao động',
    shortTitle: 'PPE',
    subtitle: 'Helmet/vest compliance',
    description: 'Phát hiện người lao động thiếu mũ bảo hộ, áo phản quang hoặc thiết bị bảo hộ theo từng khu vực sản xuất.',
    flow: ["Person/PPE Detect", "Zone Rule", "Violation Check", "HSE Event"],
    detectionGoal: 'Phát hiện trạng thái mặc/thiếu mũ bảo hộ (helmet) và áo phản quang (vest) của nhân viên.',
    eventOutput: 'Ảnh crop cận cảnh người vi phạm lỗi PPE, lưu log chấm điểm HSE nhà xưởng.',
    coreStack: [
      { name: 'YOLO11m-PPE hoặc YOLO26m-PPE', role: 'Phát hiện người và trang phục bảo hộ đa nhãn' },
      { name: 'Zone Rule', role: 'Áp dụng quy tắc PPE riêng biệt cho từng khu vực' },
      { name: 'Violation Check', role: 'Rule Engine đối chiếu trạng thái thực tế' },
      { name: 'HSE Event', role: 'Ghi nhận lỗi vi phạm và đẩy về dashboard HSE' }
    ],
    whyChoose: [
      'YOLO size m mang lại sự cân bằng hoàn hảo giữa độ chính xác nhận diện vật thể nhỏ (mũ, áo phản quang) và FPS.',
      'Mô hình đa nhãn (multi-label) nhận diện đồng thời người và trang phục bảo hộ trong một lượt forward.'
    ],
    benchmarkNotes: [
      'Cần thu thập và fine-tune mẫu mũ, màu sắc áo bảo hộ thực tế của nhà máy Gia Lâm.',
      'Lưu ý góc camera quá cao nhìn từ trên xuống có thể che khuất mũ bảo hộ.'
    ],
    optionalBenchmarks: [
      { name: 'RT-DETR', when: 'Khi công nhân đứng xa camera hoặc đứng chen chúc.', reason: 'Transformer xử lý che khuất chồng chéo và vật thể nhỏ tốt hơn YOLO.' },
      { name: 'D-FINE', when: 'Khi cần benchmark thêm precision/recall.', reason: 'Kiến trúc mạng cải tiến cho kết quả định vị bounding box chính xác hơn.' }
    ],
    futureResearch: [
      { name: 'Pose/cascade PPE', reason: 'Nhận diện các chi tiết bảo hộ phức tạp như găng tay, kính bảo hộ, dây an toàn dựa trên phân tích tư thế.' }
    ],
    warning: 'Cần benchmark theo từng khu vực, góc camera và khoảng cách. Không áp cùng một rule PPE cho mọi camera.',
    note: 'Hiệu quả phụ thuộc lớn vào việc fine-tune mô hình với chính xác màu sắc đồng phục thực tế của nhà máy.'
  },
  {
    id: 4,
    title: 'Chấm công khuôn mặt',
    shortTitle: 'Chấm công',
    subtitle: 'Face embedding + Milvus',
    description: 'Nhận diện khuôn mặt tại cổng/kiosk/điểm chấm công cố định để ghi nhận giờ vào/ra tự động.',
    flow: ["Face Detection", "Alignment", "Embedding", "Milvus Search", "Attendance Log"],
    detectionGoal: 'Phát hiện, căn chỉnh và trích xuất đặc trưng khuôn mặt của nhân viên khi check-in.',
    eventOutput: 'Ảnh chụp lúc chấm công, mã số nhân viên xác định và lịch sử log check-in/out.',
    coreStack: [
      { name: 'SCRFD 500M / SCRFD 2.5G', role: 'Phát hiện & căn chỉnh khuôn mặt (Detection & Align)' },
      { name: 'ArcFace R50 hoặc MobileFaceNet', role: 'Trích xuất vector đặc trưng khuôn mặt (Embedding)' },
      { name: 'Milvus', role: 'Tìm kiếm và so khớp vector đặc trưng nhân viên' },
      { name: 'Attendance Log', role: 'Ghi nhận giờ công và đồng bộ dữ liệu với HRM' }
    ],
    whyChoose: [
      'SCRFD siêu nhẹ và nhạy, xử lý mặt nghiêng tốt; ArcFace R50 cho không gian đặc trưng có độ phân biệt cực cao.',
      'Milvus hỗ trợ truy vấn vector dưới mili-giây, dễ dàng mở rộng khi nhân sự nhà máy tăng lên hàng ngàn người.'
    ],
    benchmarkNotes: [
      'Yêu cầu lắp đặt camera tại vị trí cố định, đủ ánh sáng trực diện và công nhân chủ động dừng lại 1-2 giây.',
      'Không dùng YOLO để nhận diện từng cá nhân. Không nhận diện khuôn mặt diện rộng toàn nhà máy.'
    ],
    optionalBenchmarks: [
      { name: 'RetinaFace', when: 'Khi cần mô hình face detector có độ chính xác cao hơn.', reason: 'Mô hình detector phổ biến với nhiều pre-trained weight ổn định.' },
      { name: 'FaceNet', when: 'Cần so sánh embedding với thư viện mã nguồn mở.', reason: 'Baseline dễ triển khai và kiểm chứng nhanh.' }
    ],
    futureResearch: [
      { name: 'Anti-spoofing/liveness', reason: 'Tích hợp thuật toán chống giả mạo khuôn mặt bằng ảnh in hoặc màn hình điện thoại khi dùng chấm công chính thức.' }
    ],
    warning: 'Không nhận diện khuôn mặt tràn lan toàn nhà máy. Cần consent, phân quyền, retention, mã hóa dữ liệu và audit log.',
    note: 'Dữ liệu sinh trắc học là thông tin nhạy cảm: Yêu cầu chính sách bảo mật nghiêm ngặt và lưu trữ cục bộ mã hóa.'
  }
];
