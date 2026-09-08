export interface PaymentProvider {
  createCheckoutSession(userId: string, planId: string): Promise<string>;
  verifyWebhook(payload: any, signature: string): boolean;
}

export class MockPaymentProvider implements PaymentProvider {
  async createCheckoutSession(userId: string, planId: string): Promise<string> {
    console.log(`[Mock Payment] Creating session for user ${userId}, plan ${planId}`);
    return "https://mock-checkout.stripe.com/session_123";
  }

  verifyWebhook(payload: any, signature: string): boolean {
    console.log(`[Mock Payment] Verifying webhook with signature ${signature}`);
    return true;
  }
}
