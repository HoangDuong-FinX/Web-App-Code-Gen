// Fixture for payment payload
export interface PaymentPayloadFixture {
  bookingKey: string;
  amount: number;
}

export const fixturePaymentPayload: PaymentPayloadFixture = {
  bookingKey: 'BK-FIXTURE',
  amount: 1190000,
};
