export interface StorageProvider {
  uploadFile(fileName: string, fileBuffer: Buffer): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
}

export class MockStorageProvider implements StorageProvider {
  async uploadFile(fileName: string, fileBuffer: Buffer): Promise<string> {
    console.log(`[Mock Storage] Uploading ${fileName} (${fileBuffer.length} bytes)`);
    return `https://mock-storage.com/files/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    console.log(`[Mock Storage] Deleting ${fileUrl}`);
  }
}
