import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Generic } from '../src/clsGeneric';

class MockFileReader {
  static mode: 'success' | 'error' = 'success';
  static buffer = new Uint8Array([80, 75, 3, 4]).buffer;

  result: ArrayBuffer | null = null;
  error: Error | null = null;
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;

  readAsArrayBuffer(_blob: Blob): void {
    if (MockFileReader.mode === 'error') {
      this.error = new Error('reader failed');
      this.onerror?.call(this as unknown as FileReader, new ProgressEvent('error'));
      return;
    }

    this.result = MockFileReader.buffer;
    this.onload?.call(this as unknown as FileReader, new ProgressEvent('load'));
  }
}

describe('Generic.unzipFile', () => {
  const originalFileReader = globalThis.FileReader;
  const originalZlib = (globalThis as typeof globalThis & { Zlib?: unknown }).Zlib;

  beforeEach(() => {
    MockFileReader.mode = 'success';
    MockFileReader.buffer = new Uint8Array([80, 75, 3, 4]).buffer;
    globalThis.FileReader = MockFileReader as unknown as typeof FileReader;
  });

  afterEach(() => {
    globalThis.FileReader = originalFileReader;
    if (originalZlib === undefined) {
      delete (globalThis as typeof globalThis & { Zlib?: unknown }).Zlib;
    } else {
      (globalThis as typeof globalThis & { Zlib?: unknown }).Zlib = originalZlib;
    }
    vi.restoreAllMocks();
  });

  it('routes unzip callback errors to the read-error handler', () => {
    const unzipError = vi.fn();
    const readError = vi.fn();

    (globalThis as typeof globalThis & { Zlib?: unknown }).Zlib = {
      Unzip: class {
        constructor(_buffer: Uint8Array) {}
        getFilenames(): string[] {
          return ['sample.json'];
        }
        decompress(_filename: string): Uint8Array {
          return new Uint8Array([123, 125]);
        }
      }
    };

    Generic.unzipFile(
      new Blob(['dummy']),
      () => {
        throw new Error('post process failed');
      },
      unzipError,
      readError
    );

    expect(unzipError).not.toHaveBeenCalled();
    expect(readError).toHaveBeenCalledTimes(1);
    expect(readError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect((readError.mock.calls[0][0] as Error).message).toBe('post process failed');
  });

  it('keeps unzip failures on the unzip error handler', () => {
    const unzipError = vi.fn();
    const readError = vi.fn();

    (globalThis as typeof globalThis & { Zlib?: unknown }).Zlib = {
      Unzip: class {
        constructor(_buffer: Uint8Array) {
          throw new Error('zip failed');
        }
      }
    };

    Generic.unzipFile(new Blob(['dummy']), vi.fn(), unzipError, readError);

    expect(unzipError).toHaveBeenCalledTimes(1);
    expect((unzipError.mock.calls[0][0] as Error).message).toBe('zip failed');
    expect(readError).not.toHaveBeenCalled();
  });
});
