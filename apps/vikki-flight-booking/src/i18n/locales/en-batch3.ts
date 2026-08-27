// English translations for batch 3 screens

const enBatch3 = {
  // Payment success screen
  'paymentSuccess.title': 'Booking Successful',
  'paymentSuccess.statusAriaLabel': 'Status: Booking successful',
  'paymentSuccess.bookingRefLabel': 'Booking Reference',
  'paymentSuccess.bookingRefAriaLabel': 'Booking Reference: {ref}. Tap to copy.',
  'paymentSuccess.summaryAriaLabel': 'Booking details',
  'paymentSuccess.share': 'Share',
  'paymentSuccess.shareAriaLabel': 'Share booking details',
  'paymentSuccess.shareTitle': 'Booking Confirmation',
  'paymentSuccess.shareText': 'Booking reference:',
  'paymentSuccess.home': 'Go Home',
  'paymentSuccess.homeAriaLabel': 'Go to home page',
  'paymentSuccess.bookAnother': 'Book Another',
  'paymentSuccess.bookAnotherAriaLabel': 'Book another flight',
  'paymentSuccess.copy': 'Copy',
  'paymentSuccess.copied': 'Copied',
  'paymentSuccess.copyAriaLabel': 'Copy booking reference',
  'paymentSuccess.servicesSelected': 'services selected',
  'paymentSuccess.simulationWarning': 'This is a simulated payment. No funds were deducted.',

  // Payment failed screen
  'paymentFailed.title': 'Payment Failed',
  'paymentFailed.heading': 'Payment Unsuccessful',
  'paymentFailed.statusAriaLabel': 'Status: Payment unsuccessful',
  'paymentFailed.defaultError': 'Transaction declined',
  'paymentFailed.noCharge': 'Your card has not been charged.',
  'paymentFailed.reasonAriaLabel': 'Reason: {reason}',
  'paymentFailed.amountAriaLabel': 'Amount: {amount} VND',
  'paymentFailed.summaryAriaLabel': 'Booking summary',
  'paymentFailed.home': 'Go Home',
  'paymentFailed.homeAriaLabel': 'Go to home page',
  'paymentFailed.retry': 'Retry',
  'paymentFailed.retryAriaLabel': 'Retry payment',

  // Payment partial screen
  'paymentPartial.title': 'Partial Payment',
  'paymentPartial.heading': 'Partial Payment',
  'paymentPartial.statusAriaLabel': 'Status: Partial payment successful',
  'paymentPartial.explanation': 'Outbound flight succeeded, return flight failed',
  'paymentPartial.outboundLeg': 'Outbound',
  'paymentPartial.returnLeg': 'Return',
  'paymentPartial.statusSuccess': 'Successful',
  'paymentPartial.statusFailed': 'Failed',
  'paymentPartial.outboundAriaLabel': 'Outbound: Successful. {flight}',
  'paymentPartial.returnAriaLabel': 'Return: Failed. {flight}. Reason: {reason}',
  'paymentPartial.outboundRefLabel': 'Outbound Booking Reference',
  'paymentPartial.outboundRefAriaLabel': 'Outbound Booking Reference: {ref}. Tap to copy.',
  'paymentPartial.rebookHint': 'You can book the return flight separately',
  'paymentPartial.home': 'Go Home',
  'paymentPartial.homeAriaLabel': 'Go to home page',
} as const;

export default enBatch3;
