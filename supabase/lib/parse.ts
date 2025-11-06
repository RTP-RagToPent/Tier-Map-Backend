/**
 * 文字列を整数に変換する関数
 * @param {string} value
 * @returns {number | undefined} 変換に成功した場合は整数、失敗した場合はundefined
 */
function parseInt(value: string): number | undefined {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export { parseInt };
