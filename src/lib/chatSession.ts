export function getOrCreateChatId(scope: string): string {
  const storageKey = `chatId:${scope}`;

  try {
    const existing = sessionStorage.getItem(storageKey);
    if (existing) return existing;

    const chatId = crypto.randomUUID();
    sessionStorage.setItem(storageKey, chatId);
    return chatId;
  } catch {
    return crypto.randomUUID();
  }
}
