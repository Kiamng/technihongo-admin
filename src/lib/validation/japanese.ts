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

  const japaneseChars = text.match(japaneseCharRegex) || [];
  const emojiChars = text.match(emojiOrSymbolRegex) || [];
  const allowedChars = text.match(allowedPunctuationRegex) || [];

  const totalValidChars = text.length - emojiChars.length;

  if (emojiChars.length > 0) return false;
  if (totalValidChars <= 2) return japaneseChars.length === totalValidChars;

  const ratio = (japaneseChars.length + allowedChars.length) / totalValidChars;
  return ratio >= threshold;
};

export const isMostlyVietnamese = (text: string, threshold: number = 0.8): boolean => {
  // Chữ cái tiếng Việt (có dấu) + chữ cái Latin không dấu
  const vietnameseOrLatinRegex = /[A-Za-zÀ-Ỵà-ỵĂăÂâĐđÊêÔôƠơƯư]/gu;
  const punctuationRegex = /[.,!?]/gu;
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  const letters = text.match(vietnameseOrLatinRegex) || [];
  const punctuations = text.match(punctuationRegex) || [];
  const emojiChars = text.match(emojiRegex) || [];

  // Bỏ khoảng trắng ra khỏi tổng số ký tự
  const pureText = text.replace(/\s/g, "");
  const pureTotalChars = pureText.length;

  if (emojiChars.length > 0) return false;
  if (pureTotalChars <= 2) return letters.length === pureTotalChars;

  const validCount = letters.length + punctuations.length;
  const ratio = validCount / pureTotalChars;

  return ratio >= threshold;
};

