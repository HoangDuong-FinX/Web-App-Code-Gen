// These keys must be MERGED into src/i18n/locales/en.ts from batch 1.

const enBatch2 = {
  // Services screen
  'services.title': 'Services & Seats',
  'services.headerSummary': 'Select additional services for your flight',
  'services.continue': 'Continue',
  'services.continue.ariaLabel': 'Continue to review',
  'services.loading': 'Loading services...',
  'services.loadFailed': 'Unable to load services. Please try again.',
  'services.submitFailed': 'Unable to save selected services. Please try again.',
  'services.seatSubmitFailed': 'Unable to save seat selections. Please try again.',
  'services.selected': 'selected',
  'services.tile.ariaLabel': '{title}, {count} selected',
  'services.noOptions': 'No additional services available for this flight.',
  'services.skip': 'Skip',

  // Review screen
  'review.title': 'Review',
  'review.flightSection': 'Flight',
  'review.passengersSection': 'Passengers',
  'review.servicesSection': 'Selected services',
  'review.priceSection': 'Price details',
  'review.total': 'Total',
  'review.continue': 'Continue',
  'review.continue.ariaLabel': 'Continue to payment',
  'review.edit': 'Edit',
  'review.edit.ariaLabel': 'Edit booking details',
  'review.outbound': 'Outbound',
  'review.return': 'Return',
  'review.outboundFlight.ariaLabel': 'Outbound: {airline} {flightNumber}',
  'review.returnFlight.ariaLabel': 'Return: {airline} {flightNumber}',
  'review.noServices': 'No additional services',
  'review.ticketPrice': 'Ticket price',
  'review.servicesPrice': 'Additional services',
  'review.seatPrice': 'Seat selection',
  'review.infantSurcharge': 'Infant surcharge (+10%)',

  // Checkout screen
  'checkout.title': 'Payment',
  'checkout.expandSummary': 'Tap to view booking details',
  'checkout.summaryJourney': 'Journey',
  'checkout.summaryPassengers': 'Passengers',
  'checkout.summaryServices': 'Services',
  'checkout.summaryTotal': 'Total',
  'checkout.totalLabel': 'Total payment',
  'checkout.totalAriaLabel': 'Total payment: {amount} VND',
  'checkout.paymentMethod': 'Select payment method',
  'checkout.termsLabel': 'I agree to the terms and conditions',
  'checkout.payButton': 'Pay',
  'checkout.payButton.ariaLabel': 'Pay',
  'checkout.loadFailed': 'Unable to load payment details. Please try again.',
  'checkout.paymentFailed': 'Payment could not connect. Please try again.',
  'checkout.termsRequired': 'Please agree to the terms and conditions',
  'checkout.loading': 'Loading...',

  // Payment pending screen
  'paymentPending.title': 'Processing',
  'paymentPending.heading': 'Processing payment',
  'paymentPending.doNotClose': 'Please do not close the app',
  'paymentPending.amountAriaLabel': 'Amount being processed: {amount} VND',
  'paymentPending.timerAriaLabel': 'Time remaining: {time}',
  'paymentPending.spinnerAriaLabel': 'Processing payment',

  // Payment method options
  'paymentMethod.bankTransfer': 'Bank transfer',
  'paymentMethod.eWallet': 'E-wallet',
  'paymentMethod.card': 'Credit/Debit card',
} as const;

export default enBatch2;
