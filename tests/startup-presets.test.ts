import {
  getStartupPresetById,
  getStartupPresetRequest,
  hasLegacyFileRequest,
  isSafeStartupFilePath,
  startupPresets,
} from '../src/startupPresets';

describe('startupPresets', () => {
  it('hash の preset を優先して起動プリセットを解決する', () => {
    expect(getStartupPresetRequest('?preset=japan-pref', '#preset=tokyo-census-2015')).toBe('tokyo-census-2015');
  });

  it('query の preset も後方互換で解釈できる', () => {
    expect(getStartupPresetRequest('?preset=japan-climate', '')).toBe('japan-climate');
  });

  it('unknown な preset は allowlist に含まれない', () => {
    expect(getStartupPresetById('unknown-preset')).toBeUndefined();
  });

  it('legacy file パラメータを検出できる', () => {
    expect(hasLegacyFileRequest('?file=data/japan_data.mdrj', '')).toBe(true);
    expect(hasLegacyFileRequest('', '#file=data/japan_data.mdrj')).toBe(true);
  });

  it('公開 preset のファイルパスは相対 allowlist に制限される', () => {
    for (const preset of Object.values(startupPresets)) {
      expect(isSafeStartupFilePath(preset.filePath)).toBe(true);
      expect(/\.(mdrj|mdrmj)$/i.test(preset.filePath)).toBe(true);
    }
  });

  it('外部 URL や親ディレクトリ参照は不正として拒否する', () => {
    expect(isSafeStartupFilePath('https://example.com/data.mdrj')).toBe(false);
    expect(isSafeStartupFilePath('../data/japan_data.mdrj')).toBe(false);
    expect(isSafeStartupFilePath('//example.com/data.mdrj')).toBe(false);
  });
});