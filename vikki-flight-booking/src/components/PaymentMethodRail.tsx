import React from 'react';

interface PaymentMethodRailProps {
  testId?: string;
}

export default function PaymentMethodRail({ testId }: PaymentMethodRailProps) {
  return (
    <div className="flex gap-2" data-testid={testId}>
      <button className="flex-1 p-3 border-2 border-blue-500 bg-blue-50 rounded-lg font-medium text-sm">
        💳 Thẻ
      </button>
      <button className="flex-1 p-3 border-2 border-gray-200 rounded-lg font-medium text-sm hover:border-gray-300">
        📱 Ví điện tử
      </button>
    </div>
  );
}
