export const isMostlyJapanese = (text: string, threshold: number = 0.8): boolean => {
  const japaneseCharRegex = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]/gu;
  const emojiOrSymbolRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  const japaneseChars = text.match(japaneseCharRegex) || [];
  const emojiChars = text.match(emojiOrSymbolRegex) || [];

  const totalChars = text.length;

  if (emojiChars.length > 0) return false;
  if (totalChars <= 2) return japaneseChars.length === totalChars;

  const ratio = japaneseChars.length / totalChars;
  return ratio >= threshold;
};

export const isKanaOnly = (text: string): boolean => {
  const kanaOnlyRegex = /^[\p{Script=Hiragana}\p{Script=Katakana}\sー・、。！？～]+$/u;
  return kanaOnlyRegex.test(text.trim());
};

export const ScriptValidate = (text: string, threshold: number = 0.8): boolean => {
  const japaneseCharRegex = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]/gu;
  const emojiOrSymbolRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const allowedPunctuationRegex = /[!?！？]/gu;

  // Match các kí tự Nhật
  const japaneseChars = text.match(japaneseCharRegex) || [];
  // Match emoji
  const emojiChars = text.match(emojiOrSymbolRegex) || [];
  // Match dấu ! ? cho phép
  const allowedChars = text.match(allowedPunctuationRegex) || [];

  // Tổng số kí tự hợp lệ (kí tự bình thường + dấu ! ?)
  const totalValidChars = text.length - emojiChars.length;

  if (emojiChars.length > 0) return false;
  if (totalValidChars <= 2) return japaneseChars.length === totalValidChars;

  const ratio = (japaneseChars.length + allowedChars.length) / totalValidChars;
  return ratio >= threshold;
};