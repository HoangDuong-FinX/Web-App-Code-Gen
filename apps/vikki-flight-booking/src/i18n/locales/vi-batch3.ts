// These keys must be MERGED into src/i18n/locales/vi.ts (after batch 1 + batch 2 keys).
// They are the i18n keys needed by payment-success, payment-failed, and payment-partial screens.

const viBatch3 = {
  // Payment success screen
  'paymentSuccess.title': 'Đặt vé thành công',
  'paymentSuccess.statusAriaLabel': 'Trạng thái: Đặt vé thành công',
  'paymentSuccess.bookingRefLabel': 'Mã đặt vé',
  'paymentSuccess.bookingRefAriaLabel': 'Mã đặt vé: {ref}. Nhấn để sao chép.',
  'paymentSuccess.summaryAriaLabel': 'Chi tiết đặt vé',
  'paymentSuccess.share': 'Chia sẻ',
  'paymentSuccess.shareAriaLabel': 'Chia sẻ thông tin đặt vé',
  'paymentSuccess.shareTitle': 'Xác nhận đặt vé',
  'paymentSuccess.shareText': 'Mã đặt vé:',
  'paymentSuccess.home': 'Về trang chủ',
  'paymentSuccess.homeAriaLabel': 'Về trang chủ',
  'paymentSuccess.bookAnother': 'Đặt vé khác',
  'paymentSuccess.bookAnotherAriaLabel': 'Đặt vé chuyến bay khác',
  'paymentSuccess.copy': 'Sao chép',
  'paymentSuccess.copied': 'Đã sao chép',
  'paymentSuccess.copyAriaLabel': 'Sao chép mã đặt vé',
  'paymentSuccess.servicesSelected': 'dịch vụ đã chọn',
  'paymentSuccess.simulationWarning': 'Đây là thanh toán mô phỏng. Không có khoản tiền nào bị trừ.',

  // Payment failed screen
  'paymentFailed.title': 'Thanh toán thất bại',
  'paymentFailed.heading': 'Thanh toán không thành công',
  'paymentFailed.statusAriaLabel': 'Trạng thái: Thanh toán không thành công',
  'paymentFailed.defaultError': 'Giao dịch bị từ chối',
  'paymentFailed.noCharge': 'Thẻ của bạn chưa bị trừ tiền.',
  'paymentFailed.reasonAriaLabel': 'Lý do: {reason}',
  'paymentFailed.amountAriaLabel': 'Số tiền: {amount} VND',
  'paymentFailed.summaryAriaLabel': 'Tóm tắt đặt chỗ',
  'paymentFailed.home': 'Về trang chủ',
  'paymentFailed.homeAriaLabel': 'Về trang chủ',
  'paymentFailed.retry': 'Thử lại',
  'paymentFailed.retryAriaLabel': 'Thử thanh toán lại',

  // Payment partial screen
  'paymentPartial.title': 'Thanh toán một phần',
  'paymentPartial.heading': 'Thanh toán một phần',
  'paymentPartial.statusAriaLabel': 'Trạng thái: Thanh toán một phần thành công',
  'paymentPartial.explanation': 'Chuyến đi thành công, chuyến về không thành công',
  'paymentPartial.outboundLeg': 'Chuyến đi',
  'paymentPartial.returnLeg': 'Chuyến về',
  'paymentPartial.statusSuccess': 'Thành công',
  'paymentPartial.statusFailed': 'Thất bại',
  'paymentPartial.outboundAriaLabel': 'Chuyến đi: Thành công. {flight}',
  'paymentPartial.returnAriaLabel': 'Chuyến về: Thất bại. {flight}. Lý do: {reason}',
  'paymentPartial.outboundRefLabel': 'Mã đặt vé chuyến đi',
  'paymentPartial.outboundRefAriaLabel': 'Mã đặt vé chuyến đi: {ref}. Nhấn để sao chép.',
  'paymentPartial.rebookHint': 'Bạn có thể đặt vé chuyến về sau',
  'paymentPartial.home': 'Về trang chủ',
  'paymentPartial.homeAriaLabel': 'Về trang chủ',
} as const;

export default viBatch3;

// ---
