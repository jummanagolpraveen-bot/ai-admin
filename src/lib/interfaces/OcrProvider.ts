export interface OcrProvider {
  extractText(fileUrl: string): Promise<string>;
}

export class MockOcrProvider implements OcrProvider {
  async extractText(fileUrl: string): Promise<string> {
    console.log(`[Mock OCR] Extracting text from ${fileUrl}`);
    return "MOCK_OCR_TEXT: INVOICE DUE 2026-10-01 AMOUNT $50.00";
  }
}
