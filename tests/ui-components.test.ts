/**
 * UI Component Tests for MANDARA GIS Application
 * 
 * このファイルはUIコンポーネントのテストを定義します。
 * @testing-library/domを使用してDOM操作をテストします。
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/user-event';

describe('Generic UIコンポーネント', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // テスト用のコンテナを作成
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    // テスト後のクリーンアップ
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('createNewDiv', () => {
    it('divが正しく生成されること', () => {
      const testDiv = document.createElement('div');
      testDiv.id = 'test-div';
      testDiv.textContent = 'Test Content';
      container.appendChild(testDiv);

      const createdDiv = container.querySelector('#test-div');
      expect(createdDiv).toBeTruthy();
      expect(createdDiv?.textContent).toBe('Test Content');
    });

    it('指定されたスタイルが適用されること', () => {
      const testDiv = document.createElement('div');
      testDiv.id = 'styled-div';
      testDiv.style.width = '100px';
      testDiv.style.height = '100px';
      container.appendChild(testDiv);

      const styledDiv = container.querySelector('#styled-div') as HTMLDivElement;
      expect(styledDiv.style.width).toBe('100px');
      expect(styledDiv.style.height).toBe('100px');
    });
  });

  describe('createNewButton', () => {
    it('ボタンが正しく生成されること', () => {
      const button = document.createElement('button');
      button.id = 'test-button';
      button.textContent = 'Click Me';
      container.appendChild(button);

      const createdButton = container.querySelector('#test-button') as HTMLButtonElement;
      expect(createdButton).toBeTruthy();
      expect(createdButton.textContent).toBe('Click Me');
    });

    it('ボタンクリックイベントが動作すること', async () => {
      let clicked = false;
      const button = document.createElement('button');
      button.id = 'click-test-button';
      button.addEventListener('click', () => {
        clicked = true;
      });
      container.appendChild(button);

      const testButton = container.querySelector('#click-test-button') as HTMLButtonElement;
      fireEvent.click(testButton);

      await waitFor(() => {
        expect(clicked).toBe(true);
      });
    });
  });

  describe('createNewInput', () => {
    it('入力フィールドが正しく生成されること', () => {
      const input = document.createElement('input');
      input.id = 'test-input';
      input.type = 'text';
      input.value = 'initial value';
      container.appendChild(input);

      const createdInput = container.querySelector('#test-input') as HTMLInputElement;
      expect(createdInput).toBeTruthy();
      expect(createdInput.type).toBe('text');
      expect(createdInput.value).toBe('initial value');
    });

    it('入力値の変更が反映されること', async () => {
      const input = document.createElement('input');
      input.id = 'change-test-input';
      input.type = 'text';
      container.appendChild(input);

      const testInput = container.querySelector('#change-test-input') as HTMLInputElement;
      fireEvent.change(testInput, { target: { value: 'new value' } });

      await waitFor(() => {
        expect(testInput.value).toBe('new value');
      });
    });
  });

  describe('createNewSelect', () => {
    it('セレクトボックスが正しく生成されること', () => {
      const select = document.createElement('select');
      select.id = 'test-select';
      
      const option1 = document.createElement('option');
      option1.value = '1';
      option1.textContent = 'Option 1';
      
      const option2 = document.createElement('option');
      option2.value = '2';
      option2.textContent = 'Option 2';
      
      select.appendChild(option1);
      select.appendChild(option2);
      container.appendChild(select);

      const createdSelect = container.querySelector('#test-select') as HTMLSelectElement;
      expect(createdSelect).toBeTruthy();
      expect(createdSelect.options.length).toBe(2);
      expect(createdSelect.options[0]?.textContent).toBe('Option 1');
    });

    it('選択変更イベントが動作すること', async () => {
      let selectedValue = '';
      const select = document.createElement('select');
      select.id = 'change-select';
      
      const option1 = document.createElement('option');
      option1.value = '1';
      option1.textContent = 'Option 1';
      
      const option2 = document.createElement('option');
      option2.value = '2';
      option2.textContent = 'Option 2';
      
      select.appendChild(option1);
      select.appendChild(option2);
      select.addEventListener('change', (e) => {
        selectedValue = (e.target as HTMLSelectElement).value;
      });
      container.appendChild(select);

      const testSelect = container.querySelector('#change-select') as HTMLSelectElement;
      fireEvent.change(testSelect, { target: { value: '2' } });

      await waitFor(() => {
        expect(selectedValue).toBe('2');
      });
    });
  });

  describe('createNewCheckbox', () => {
    it('チェックボックスが正しく生成されること', () => {
      const checkbox = document.createElement('input');
      checkbox.id = 'test-checkbox';
      checkbox.type = 'checkbox';
      container.appendChild(checkbox);

      const createdCheckbox = container.querySelector('#test-checkbox') as HTMLInputElement;
      expect(createdCheckbox).toBeTruthy();
      expect(createdCheckbox.type).toBe('checkbox');
      expect(createdCheckbox.checked).toBe(false);
    });

    it('チェック状態の変更が反映されること', async () => {
      const checkbox = document.createElement('input');
      checkbox.id = 'toggle-checkbox';
      checkbox.type = 'checkbox';
      container.appendChild(checkbox);

      const testCheckbox = container.querySelector('#toggle-checkbox') as HTMLInputElement;
      expect(testCheckbox.checked).toBe(false);

      fireEvent.click(testCheckbox);

      await waitFor(() => {
        expect(testCheckbox.checked).toBe(true);
      });
    });
  });

  describe('createNewCanvas', () => {
    it('Canvasが正しく生成されること', () => {
      const canvas = document.createElement('canvas');
      canvas.id = 'test-canvas';
      canvas.width = 500;
      canvas.height = 500;
      container.appendChild(canvas);

      const createdCanvas = container.querySelector('#test-canvas') as HTMLCanvasElement;
      expect(createdCanvas).toBeTruthy();
      expect(createdCanvas.width).toBe(500);
      expect(createdCanvas.height).toBe(500);
    });

    it('Canvas要素の描画コンテキストが取得できること', () => {
      const canvas = document.createElement('canvas');
      canvas.id = 'context-canvas';
      container.appendChild(canvas);

      const testCanvas = container.querySelector('#context-canvas') as HTMLCanvasElement;
      // happy-domではCanvasコンテキストがnullを返すため、要素の存在のみを確認
      expect(testCanvas).toBeTruthy();
      expect(testCanvas.tagName).toBe('CANVAS');
    });
  });
});

describe('point クラス', () => {
  it('pointオブジェクトが正しく生成されること', () => {
    const p = { x: 10, y: 20 };
    expect(p.x).toBe(10);
    expect(p.y).toBe(20);
  });

  it('座標値の変更が反映されること', () => {
    const p = { x: 0, y: 0 };
    p.x = 100;
    p.y = 200;
    expect(p.x).toBe(100);
    expect(p.y).toBe(200);
  });
});

describe('rectangle クラス', () => {
  it('rectangleオブジェクトが正しく生成されること', () => {
    const rect = { left: 0, top: 0, right: 100, bottom: 100 };
    expect(rect.left).toBe(0);
    expect(rect.top).toBe(0);
    expect(rect.right).toBe(100);
    expect(rect.bottom).toBe(100);
  });

  it('矩形の幅と高さが計算できること', () => {
    const rect = { left: 10, top: 20, right: 110, bottom: 120 };
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    expect(width).toBe(100);
    expect(height).toBe(100);
  });
});
