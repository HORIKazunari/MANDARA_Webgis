/**
 * Vite テンプレート用のカウンターボタンを初期化します。
 *
 * @param element カウント表示とクリックを担当するボタン要素です。
 */
export function setupCounter(element: HTMLButtonElement): void {
  let counter = 0
  /**
   * カウンター値を内部状態と表示へ反映します。
   *
   * @param count 新しいカウント値です。
   */
  const setCounter = (count: number): void => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}
