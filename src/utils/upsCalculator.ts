export interface UpsCalcInputs {
  serverLoadW: number;
  nasLoadW: number;
  switchLoadW: number;
  otherLoadW: number;
  upsSizeKVA: number; // 2, 3, 5, or custom number
  powerFactor: number; // default 0.9
  batteryWhInput?: number; // optional custom battery energy
}

export interface UpsCalcOutputs {
  totalLoadW: number;
  upsMaxW: number;
  loadPercent: number;
  estimatedRuntimeMinutes: number;
  status: 'green' | 'amber' | 'red';
  recommendation: string;
}

export function calculateUps(inputs: UpsCalcInputs): UpsCalcOutputs {
  const {
    serverLoadW,
    nasLoadW,
    switchLoadW,
    otherLoadW,
    upsSizeKVA,
    powerFactor,
    batteryWhInput,
  } = inputs;

  const totalLoadW = serverLoadW + nasLoadW + switchLoadW + otherLoadW;
  const upsMaxW = upsSizeKVA * 1000 * powerFactor;
  const loadPercent = (totalLoadW / upsMaxW) * 100;

  // Assign battery capacity in Wh based on UPS size if not provided
  let batteryWh: number;
  if (batteryWhInput && batteryWhInput > 0) {
    batteryWh = batteryWhInput;
  } else {
    if (upsSizeKVA <= 2) {
      batteryWh = 500;
    } else if (upsSizeKVA <= 3) {
      batteryWh = 800;
    } else if (upsSizeKVA <= 5) {
      batteryWh = 1400;
    } else {
      // Proportional estimate for larger custom UPS sizes
      batteryWh = upsSizeKVA * 280;
    }
  }

  // Formula: runtimeMinutes = (batteryWh * 0.8 / totalLoadW) * 60
  // 0.8 is the typical efficiency factor of the inverter
  let estimatedRuntimeMinutes = 0;
  if (totalLoadW > 0) {
    estimatedRuntimeMinutes = (batteryWh * 0.8 / totalLoadW) * 60;
  }

  let status: 'green' | 'amber' | 'red';
  let recommendation: string;

  if (loadPercent > 100) {
    status = 'red';
    recommendation = 'Quá tải! Tổng công suất thiết bị vượt quá công suất định mức tối đa của UPS. Hệ thống sẽ tắt ngay lập tức hoặc báo lỗi. Hãy giảm tải thiết bị hoặc nâng cấp lên UPS công suất lớn hơn (ví dụ: 5kVA).';
  } else if (loadPercent > 80) {
    status = 'amber';
    recommendation = 'Tải UPS rất cao (>80%). Hiệu suất lưu điện sẽ giảm và UPS tỏa nhiều nhiệt. Khuyến nghị nâng cấp UPS lớn hơn để hoạt động an toàn lâu dài.';
  } else if (estimatedRuntimeMinutes < 10) {
    status = 'red';
    recommendation = `Thời gian lưu điện quá ngắn (${estimatedRuntimeMinutes.toFixed(1)} phút). Chưa đủ thời gian để hệ thống gửi cảnh báo và tắt máy chủ an toàn (Graceful Shutdown). Hãy trang bị thêm bộ pin mở rộng (battery pack).`;
  } else if (estimatedRuntimeMinutes < 20) {
    status = 'amber';
    recommendation = `Thời gian lưu điện tạm đủ (${estimatedRuntimeMinutes.toFixed(1)} phút) để thực hiện tắt hệ thống an toàn (Graceful Shutdown). Khuyến nghị cấu hình shutdown script tự động khi UPS báo pin yếu.`;
  } else {
    status = 'green';
    recommendation = `Thời gian lưu điện lý tưởng (${estimatedRuntimeMinutes.toFixed(1)} phút). Đủ thời gian để IT xử lý hoặc hệ thống tự động lưu trữ trạng thái và tắt máy an toàn. Tải UPS ở mức tối ưu (${loadPercent.toFixed(1)}%).`;
  }

  return {
    totalLoadW,
    upsMaxW,
    loadPercent,
    estimatedRuntimeMinutes,
    status,
    recommendation,
  };
}
