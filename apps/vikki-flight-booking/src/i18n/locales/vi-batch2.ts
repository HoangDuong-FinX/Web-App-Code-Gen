// These keys must be MERGED into src/i18n/locales/vi.ts from batch 1.
// They are the i18n keys needed by the services, review, checkout, and payment-pending screens.

const viBatch2 = {
  // Services screen
  'services.title': 'Dịch vụ & chọn ghế',
  'services.headerSummary': 'Chọn dịch vụ bổ sung cho chuyến bay của bạn',
  'services.continue': 'Tiếp tục',
  'services.continue.ariaLabel': 'Tiếp tục đến soát lại',
  'services.loading': 'Đang tải dịch vụ...',
  'services.loadFailed': 'Không thể tải danh sách dịch vụ. Vui lòng thử lại.',
  'services.submitFailed': 'Không thể lưu dịch vụ đã chọn. Vui lòng thử lại.',
  'services.seatSubmitFailed': 'Không thể lưu chỗ ngồi. Vui lòng thử lại.',
  'services.selected': 'đã chọn',
  'services.tile.ariaLabel': '{title}, {count} đã chọn',
  'services.noOptions': 'Không có dịch vụ bổ sung cho chuyến bay này.',
  'services.skip': 'Bỏ qua',

  // Review screen
  'review.title': 'Soát lại',
  'review.flightSection': 'Chuyến bay',
  'review.passengersSection': 'Hành khách',
  'review.servicesSection': 'Dịch vụ đã chọn',
  'review.priceSection': 'Chi tiết giá',
  'review.total': 'Tổng cộng',
  'review.continue': 'Tiếp tục',
  'review.continue.ariaLabel': 'Tiếp tục đến thanh toán',
  'review.edit': 'Chỉnh sửa',
  'review.edit.ariaLabel': 'Chỉnh sửa thông tin đặt chỗ',
  'review.outbound': 'Chuyến đi',
  'review.return': 'Chuyến về',
  'review.outboundFlight.ariaLabel': 'Chuyến đi: {airline} {flightNumber}',
  'review.returnFlight.ariaLabel': 'Chuyến về: {airline} {flightNumber}',
  'review.noServices': 'Không có dịch vụ bổ sung',
  'review.ticketPrice': 'Giá vé',
  'review.servicesPrice': 'Dịch vụ bổ sung',
  'review.seatPrice': 'Chỗ ngồi',
  'review.infantSurcharge': 'Phụ thu em bé (+10%)',

  // Checkout screen
  'checkout.title': 'Thanh toán',
  'checkout.expandSummary': 'Nhấn để xem chi tiết đặt chỗ',
  'checkout.summaryJourney': 'Hành trình',
  'checkout.summaryPassengers': 'Hành khách',
  'checkout.summaryServices': 'Dịch vụ',
  'checkout.summaryTotal': 'Tổng cộng',
  'checkout.totalLabel': 'Tổng thanh toán',
  'checkout.totalAriaLabel': 'Tổng thanh toán: {amount} VND',
  'checkout.paymentMethod': 'Chọn phương thức thanh toán',
  'checkout.termsLabel': 'Tôi đồng ý với điều khoản và điều kiện',
  'checkout.payButton': 'Thanh toán',
  'checkout.payButton.ariaLabel': 'Thanh toán',
  'checkout.loadFailed': 'Không thể tải thông tin thanh toán. Vui lòng thử lại.',
  'checkout.paymentFailed': 'Thanh toán không thể kết nối. Vui lòng thử lại.',
  'checkout.termsRequired': 'Vui lòng đồng ý với điều khoản và điều kiện',
  'checkout.loading': 'Đang tải...',

  // Payment pending screen
  'paymentPending.title': 'Đang xử lý',
  'paymentPending.heading': 'Đang xử lý thanh toán',
  'paymentPending.doNotClose': 'Vui lòng không đóng ứng dụng',
  'paymentPending.amountAriaLabel': 'Số tiền đang xử lý: {amount} VND',
  'paymentPending.timerAriaLabel': 'Thời gian còn lại: {time}',
  'paymentPending.spinnerAriaLabel': 'Đang xử lý thanh toán',

  // Payment method options
  'paymentMethod.bankTransfer': 'Chuyển khoản ngân hàng',
  'paymentMethod.eWallet': 'Ví điện tử',
  'paymentMethod.card': 'Thẻ tín dụng/ghi nợ',
} as const;

export default viBatch2;

