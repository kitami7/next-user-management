// dateUtils.ts
/**
 * YYYY-MM-DD形式の日付文字列をYYYYMMDD形式に変換する関数
 * @param dateString - YYYY-MM-DD形式の日付文字列
 * @returns YYYYMMDD形式の日付文字列
 */
export function convertToYYYYMMDD(dateString: string): string {
    // 入力の日付文字列を分割
    const [year, month, day] = dateString.split('-');

    // YYYYMMDD形式の文字列を作成
    return `${year}${month}${day}`;
}

/**
 * YYYYMMDD形式の日付文字列を数値に変換する関数
 * @param dateString - YYYYMMDD形式の日付文字列
 * @returns 数値形式のYYYYMMDD
 */
export function dateStringToNumber(dateString: string): number {
    return parseInt(dateString, 10);
}
  
/**
 * YYYYMMDD形式の日付文字列から年齢を計算する関数
 * @param birthDateString - 誕生日を表す YYYYMMDD形式の日付文字列
 * @returns 年齢
 */
export function calculateAgeFromDateNumber(birthDateString: string): number {
    // 現在の日付を YYYYMMDD 形式の文字列に変換
    const todayDate = new Date();
    const todayDateString = `${todayDate.getFullYear()}${(todayDate.getMonth() + 1).toString().padStart(2, '0')}${todayDate.getDate().toString().padStart(2, '0')}`;

    // 数値形式に変換
    const todayNumber = dateStringToNumber(todayDateString);
    const birthDateNumber = dateStringToNumber(birthDateString);

    // 年齢を計算
    const age = Math.floor((todayNumber - birthDateNumber) / 10000);

    return age;
}