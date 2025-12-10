/**
 * ユーティリティ関数のサンプルテスト
 * 
 * このファイルはテスト環境が正しくセットアップされているかを確認するためのサンプルです
 */

import { describe, it, expect } from 'vitest';

describe('Sample Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle strings correctly', () => {
    const greeting = 'Hello, World!';
    expect(greeting).toContain('World');
    expect(greeting).toHaveLength(13);
  });

  it('should work with arrays', () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(numbers).toHaveLength(5);
    expect(numbers).toContain(3);
    expect(numbers[0]).toBe(1);
  });
});
