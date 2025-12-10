/**
 * DOM操作のサンプルテスト
 * 
 * happy-dom環境でのDOM操作テストの例
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('DOM Manipulation Tests', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // 各テストの前に新しいコンテナを作成
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should create and append elements', () => {
    const button = document.createElement('button');
    button.textContent = 'Click me';
    button.className = 'test-button';
    
    container.appendChild(button);
    
    expect(container.querySelector('.test-button')).toBeTruthy();
    expect(button.textContent).toBe('Click me');
  });

  it('should handle element styles', () => {
    const div = document.createElement('div');
    div.style.width = '100px';
    div.style.height = '50px';
    div.style.backgroundColor = 'red';
    
    container.appendChild(div);
    
    expect(div.style.width).toBe('100px');
    expect(div.style.height).toBe('50px');
    expect(div.style.backgroundColor).toBe('red');
  });

  it('should handle events', () => {
    let clicked = false;
    const button = document.createElement('button');
    
    button.addEventListener('click', () => {
      clicked = true;
    });
    
    container.appendChild(button);
    button.click();
    
    expect(clicked).toBe(true);
  });
});
