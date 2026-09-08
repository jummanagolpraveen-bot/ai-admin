export interface AiProvider {
  extractDataFromText(text: string): Promise<any>;
}

export class MockAiProvider implements AiProvider {
  async extractDataFromText(text: string): Promise<any> {
    console.log("[Mock AI] Extracting data from:", text);
    return {
      title: "Extracted Title",
      dueDate: new Date().toISOString(),
      category: "GENERAL",
    };
  }
}
