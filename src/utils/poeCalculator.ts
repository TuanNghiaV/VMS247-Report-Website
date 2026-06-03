export interface PoeCalcInputs {
  cameraCount: number;
  wattPerCamera: number;
  poeSwitchBudgetW: number;
  headroomPercent: number; // default 25
}

export interface PoeCalcOutputs {
  requiredPoE: number;
  recommendedPoE: number;
  status: 'green' | 'amber' | 'red';
  suggestion: string;
}

export function calculatePoe(inputs: PoeCalcInputs): PoeCalcOutputs {
  const { cameraCount, wattPerCamera, poeSwitchBudgetW, headroomPercent } = inputs;

  const requiredPoE = cameraCount * wattPerCamera;
  const recommendedPoE = requiredPoE * (1 + headroomPercent / 100);

  let status: 'green' | 'amber' | 'red';
  let suggestion: string;

  if (poeSwitchBudgetW < requiredPoE) {
    status = 'red';
    suggestion = `Quá tải PoE! Công suất yêu cầu (${requiredPoE}W) vượt quá công suất tối đa của Switch (${poeSwitchBudgetW}W). Hãy trang bị thêm Switch thứ 2 hoặc nâng cấp lên Switch có PoE Budget cao hơn (ví dụ: 370W hoặc 400W).`;
  } else if (poeSwitchBudgetW < recommendedPoE) {
    status = 'amber';
    suggestion = `Thiếu công suất dự phòng an toàn! Công suất tải (${requiredPoE}W) nằm sát ngưỡng giới hạn của Switch. Để tránh sự cố camera bị sập nguồn khi bật hồng ngoại vào ban đêm (khi camera ăn điện nhiều nhất), hãy dùng Switch có PoE budget lớn hơn.`;
  } else {
    status = 'green';
    suggestion = `PoE Switch đáp ứng tốt nhu cầu cấp nguồn cho toàn bộ ${cameraCount} camera và có sẵn khoảng dự phòng an toàn để mở rộng hệ thống trong tương lai.`;
  }

  return {
    requiredPoE,
    recommendedPoE,
    status,
    suggestion,
  };
}
