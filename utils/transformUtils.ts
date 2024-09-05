/**
 * Converts a string from snake_case to camelCase.
 * スネークケースの文字列をキャメルケースに変換します。
 * 
 * @param str - The snake_case string to be converted. 変換するスネークケースの文字列。
 * @returns The converted camelCase string. 変換されたキャメルケースの文字列を返します。
 */
export function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

/**
 * Converts a string from camelCase to snake_case.
 * キャメルケースの文字列をスネークケースに変換します。
 * 
 * @param str - The camelCase string to be converted. 変換するキャメルケースの文字列。
 * @returns The converted snake_case string. 変換されたスネークケースの文字列を返します。
 */
export function toSnakeCase(str: string): string {
    return str
        .replace(/([A-Z])/g, '_$1') // 大文字の前にアンダースコアを追加
        .toLowerCase();              // すべての文字を小文字に変換
}

/**
 * Converts the keys of an object from camelCase to snake_case.
 * オブジェクトのキーをキャメルケースからスネークケースに変換します。
 * 
 * @param obj - The object with camelCase keys. キャメルケースのキーを持つオブジェクト。
 * @returns A new object with snake_case keys. スネークケースのキーを持つ新しいオブジェクトを返します。
 */
export function convertKeysToSnakeCase(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const snakeCaseKey = toSnakeCase(key);
            result[snakeCaseKey] = obj[key];
        }
    }

    return result;
}

/**
 * Converts the keys of an object from snake_case to camelCase.
 * オブジェクトのキーをスネークケースからキャメルケースに変換します。
 * 
 * @param obj - The object with snake_case keys. スネークケースのキーを持つオブジェクト。
 * @returns A new object with camelCase keys. キャメルケースのキーを持つ新しいオブジェクトを返します。
 */
export function convertKeysToCamelCase(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) { // プロトタイプチェーン上のプロパティを除外
            const camelCaseKey = toCamelCase(key);
            result[camelCaseKey] = obj[key];
        }
    }
    console.log(result + "ok");
    return result;
}
