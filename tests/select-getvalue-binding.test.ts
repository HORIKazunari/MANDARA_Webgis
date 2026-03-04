import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Generic } from '../src/clsGeneric';

describe('Generic.createNewSelect getValue binding', () => {
  let host: HTMLDivElement;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
  });

  afterEach(() => {
    host.remove();
  });

  it('onchangeでgetValue呼び出し時に例外を出さない', () => {
    let selected: number | number[] | undefined;
    let value: string | undefined;

    const onChange = vi.fn((_sbox: HTMLSelectElement, sel: number | number[], v?: string) => {
      selected = sel;
      value = v;
    });

    const select = Generic.createNewSelect(host, ['A', 'B'], 0, '', 0, 0, false, onChange, '', 1, true);
    select.selectedIndex = 1;

    expect(() => {
      select.dispatchEvent(new Event('change'));
    }).not.toThrow();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(selected).toBe(1);
    expect(value).toBe('B');
  });
});
