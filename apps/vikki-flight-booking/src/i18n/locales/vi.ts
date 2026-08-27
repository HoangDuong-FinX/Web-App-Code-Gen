
const vi = {
  // Top bar titles
  'topbar.search': 'Tìm chuyến',
  'topbar.results': 'Chọn chuyến',
  'topbar.resultsReturn': 'Chọn chuyến về',
  'topbar.passengers': 'Thông tin hành khách',
  'topbar.services': 'Dịch vụ & chọn ghế',
  'topbar.review': 'Soát lại',
  'topbar.checkout': 'Thanh toán',
  'topbar.holdExpired': 'Hết hạn giữ chỗ',

  // Search screen
  'search.tripType.oneway': 'Một chiều',
  'search.tripType.round': 'Khứ hồi',
  'search.tripTypeLabel': 'Chọn loại chuyến bay',
  'search.origin.label': 'Điểm khởi hành',
  'search.origin.placeholder': 'Chọn điểm đi',
  'search.destination.label': 'Điểm đến',
  'search.destination.placeholder': 'Chọn điểm đến',
  'search.swap.ariaLabel': 'Hoán đổi điểm đi và điểm đến',
  'search.departureDate.label': 'Ngày đi',
  'search.returnDate.label': 'Ngày về',
  'search.date.placeholder': 'Chọn ngày',
  'search.passengers.label': 'Hành khách',
  'search.passengers.placeholder': '1 Người lớn',
  'search.submit': 'Tìm chuyến',
  'search.submit.ariaLabel': 'Tìm chuyến bay',

  // Validation errors
  'error.originRequired': 'Vui lòng chọn điểm đi',
  'error.destinationRequired': 'Vui lòng chọn điểm đến',
  'error.departureDateRequired': 'Vui lòng chọn ngày đi',
  'error.returnDateRequired': 'Vui lòng chọn ngày về',
  'error.returnDateAfterDeparture': 'Ngày về phải sau ngày đi',
  'error.loadAirportsFailed': 'Không thể tải danh sách sân bay. Vui lòng thử lại.',
  'error.searchFailed': 'Không thể tìm chuyến. Vui lòng thử lại.',
  'error.generic': 'Đã xảy ra lỗi. Vui lòng thử lại.',
  'error.submitPassengersFailed': 'Không thể lưu thông tin. Vui lòng thử lại.',
  'error.invalidDob': 'Ngày sinh không hợp lệ',
  'error.requiredField': 'Trường bắt buộc',

  // Results screen
  'results.summaryLabel': 'Tóm tắt chuyến bay',
  'results.dateStripLabel': 'Chọn ngày khởi hành khác',
  'results.dateStripReturnLabel': 'Chọn ngày về khác',
  'results.selectFlight': 'Chọn',
  'results.empty': 'Không tìm thấy chuyến bay. Vui lòng thử ngày khác.',
  'results.emptyReturn': 'Không tìm thấy chuyến về. Vui lòng thử ngày khác.',
  'results.emptyAriaLabel': 'Không có kết quả',
  'results.flightAriaLabel': '{airline} chuyến {departure} đến {arrival}, giá {price}',
  'results.loading': 'Đang tìm chuyến bay...',

  // Passengers screen
  'passengers.countSummary': '{adults} người lớn{childrenText}{infantsText}',
  'passengers.children': ', {count} trẻ em',
  'passengers.infants': ', {count} em bé',
  'passengers.passengerLabel': 'Hành khách {index} ({type})',
  'passengers.fullName.label': 'Họ và tên',
  'passengers.fullName.placeholder': 'Nhập họ và tên',
  'passengers.dob.label': 'Ngày sinh',
  'passengers.gender.label': 'Giới tính',
  'passengers.gender.male': 'Nam',
  'passengers.gender.female': 'Nữ',
  'passengers.gender.other': 'Khác',
  'passengers.nationality.label': 'Quốc tịch',
  'passengers.document.label': 'Số CMND/Hộ chiếu',
  'passengers.phone.label': 'Số điện thoại',
  'passengers.phone.helper': 'Bắt buộc nếu là người liên hệ chính',
  'passengers.continue': 'Tiếp tục',
  'passengers.continue.ariaLabel': 'Tiếp tục đến dịch vụ',
  'passengers.type.adult': 'Người lớn',
  'passengers.type.child': 'Trẻ em',
  'passengers.type.infant': 'Em bé',

  // Hold expired
  'holdExpired.title': 'Hết hạn giữ chỗ',
  'holdExpired.message': 'Phiên giữ chỗ đã hết hạn. Vui lòng tìm chuyến bay mới.',
  'holdExpired.restart': 'Tìm chuyến lại',

  // Navigation
  'nav.home': 'Trang chủ',
  'nav.bookings': 'Đặt chỗ',
  'nav.account': 'Tài khoản',
  'nav.ariaLabel': 'Điều hướng chính',

  // Passenger count modal
  'paxCount.title': 'Số lượng hành khách',
  'paxCount.adults': 'Người lớn',
  'paxCount.children': 'Trẻ em',
  'paxCount.infants': 'Em bé',
  'paxCount.confirm': 'Xác nhận',
  'paxCount.max': 'Tối đa 4 hành khách',

  // Location picker
  'locationPicker.title': 'Chọn địa điểm',
  'locationPicker.searchPlaceholder': 'Tìm sân bay...',

  // Date picker
  'datePicker.title': 'Chọn ngày',
  'datePicker.confirm': 'Xác nhận',

  // Common
  'common.retry': 'Thử lại',
  'common.cancel': 'Huỷ',
  'common.close': 'Đóng',
  'common.back': 'Quay lại',
  'common.loading': 'Đang tải...',
} as const;

export type TranslationKey = keyof typeof vi;
export default vi;
