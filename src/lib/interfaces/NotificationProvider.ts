export interface NotificationProvider {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendPush(userId: string, title: string, body: string): Promise<void>;
}

export class MockNotificationProvider implements NotificationProvider {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`[Mock Email] To: ${to} | Subject: ${subject}`);
    console.log(body);
  }

  async sendPush(userId: string, title: string, body: string): Promise<void> {
    console.log(`[Mock Push] User: ${userId} | Title: ${title}`);
    console.log(body);
  }
}
