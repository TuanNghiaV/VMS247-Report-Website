export interface StorageCalcInputs {
  cameraCount: number;
  bitrateMbps: number;
  retentionDays: number;
  recordingMode: 'continuous' | 'event' | 'hybrid';
  raidType: 'No RAID' | 'RAID 5' | 'RAID 6' | 'RAID 10';
  diskCapacityTB: number;
  diskCount: number;
}

export interface StorageCalcOutputs {
  dailyGB: number;
  rawTB: number;
  recommendedTB: number;
  raidUsableTB: number;
  status: 'green' | 'amber' | 'red';
  suggestion: string;
}

export function calculateStorage(inputs: StorageCalcInputs): StorageCalcOutputs {
  const {
    cameraCount,
    bitrateMbps,
    retentionDays,
    recordingMode,
    raidType,
    diskCapacityTB,
    diskCount,
  } = inputs;

  // Adjust bitrate factor based on recording mode
  let modeFactor = 1.0;
  if (recordingMode === 'event') {
    modeFactor = 0.3; // Event only: assume camera active 30% of the day
  } else if (recordingMode === 'hybrid') {
    modeFactor = 0.6; // Hybrid: 24/7 low FPS, high FPS on event
  }

  // Formula: dailyGB = cameraCount * bitrateMbps * 10.8 * modeFactor
  const dailyGB = cameraCount * bitrateMbps * 10.8 * modeFactor;
  const rawTB = (dailyGB * retentionDays) / 1024;
  const recommendedTB = rawTB * 1.3; // 30% headroom

  // RAID Usable Capacity
  let raidUsableTB: number;
  switch (raidType) {
    case 'No RAID':
      raidUsableTB = diskCount * diskCapacityTB;
      break;
    case 'RAID 5':
      raidUsableTB = Math.max(0, diskCount - 1) * diskCapacityTB;
      break;
    case 'RAID 6':
      raidUsableTB = Math.max(0, diskCount - 2) * diskCapacityTB;
      break;
    case 'RAID 10':
      raidUsableTB = (diskCount * diskCapacityTB) / 2;
      break;
    default:
      raidUsableTB = diskCount * diskCapacityTB;
  }

  // Determine status (Comparing raidUsableTB vs recommendedTB)
  let status: 'green' | 'amber' | 'red';
  let suggestion: string;

  const minDisksForRaid = {
    'No RAID': 1,
    'RAID 5': 3,
    'RAID 6': 4,
    'RAID 10': 4,
  };

  if (diskCount < minDisksForRaid[raidType]) {
    status = 'red';
    suggestion = `Cấu hình ${raidType} yêu cầu tối thiểu ${minDisksForRaid[raidType]} ổ đĩa. Hãy tăng số lượng ổ đĩa.`;
  } else if (raidType === 'RAID 10' && diskCount % 2 !== 0) {
    status = 'red';
    suggestion = 'Cấu hình RAID 10 yêu cầu số lượng ổ đĩa chẵn. Hãy tăng/giảm số lượng ổ đĩa.';
  } else if (raidUsableTB < rawTB) {
    status = 'red';
    suggestion = 'Dung lượng khả dụng của NAS thấp hơn dung lượng lưu trữ thô cần thiết. Bạn CẦN tăng số ổ đĩa, chọn dung lượng ổ lớn hơn, hoặc giảm số ngày lưu trữ.';
  } else if (raidUsableTB < recommendedTB) {
    status = 'amber';
    suggestion = 'Dung lượng khả dụng đủ cho nhu cầu cơ bản nhưng nhỏ hơn mức đề xuất (30% dự phòng). Hệ thống nên tăng thêm 1-2 ổ đĩa hoặc chuyển sang ổ dung lượng cao hơn để hoạt động ổn định lâu dài.';
  } else {
    status = 'green';
    suggestion = 'Dung lượng khả dụng của hệ thống lưu trữ hiện tại ĐỦ đáp ứng tốt nhu cầu ghi hình và có dự phòng an toàn >= 30%.';
  }

  // Suggesting model upgrades
  if (status === 'red' && diskCount > 8 && diskCapacityTB >= 12) {
    suggestion += ' Đề xuất nâng cấp lên thiết bị NAS 12-bay hoặc 16-bay chuyên dụng.';
  }

  return {
    dailyGB,
    rawTB,
    recommendedTB,
    raidUsableTB,
    status,
    suggestion,
  };
}
