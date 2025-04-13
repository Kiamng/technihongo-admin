export const containsEmoji = (text: string) =>
  /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu.test(text);

export const containsSpecialChar = (text: string) =>
  /[^a-zA-ZÀ-ỹà-ỹ0-9\s.,!?'"()\-–…:;]/u.test(text);

export const isVietnameseOrEnglish = (text: string) => {
  const vietnamese = /[à-ỹÀ-Ỹ]/;
  const english = /^[a-zA-Z\s.,!?'"()\-–…:;]+$/;
  return vietnamese.test(text) || english.test(text);
};
