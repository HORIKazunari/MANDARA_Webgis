/**
 * ブラウザー標準のコンテキストメニュー表示を抑止します。
 *
 * @param e 対象イベントです。
 */
export function contextMenuPrevent(e: Event): void {
    e.preventDefault();
}
