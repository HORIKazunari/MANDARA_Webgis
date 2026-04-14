import {
  extractReferencedMapFileNames,
  getServerMapCandidates,
} from '../src/serverMapLoader';

describe('serverMapLoader', () => {
  it('既知の地図名をサーバー上のファイル名へ解決できる', () => {
    expect(getServerMapCandidates('日本緯度経度.mpfj')).toContain('japanLatLon.mpfj');
    expect(getServerMapCandidates('JAPAN.mpfj')).toContain('JAPAN.mpfj');
  });

  it('mdrj の外部地図参照を抽出できる', () => {
    const attrText = JSON.stringify({
      LayerData: [
        { MapFileName: 'JAPAN.mpfj' },
        { MapFileName: '日本緯度経度.mpfj' },
        { MapFileName: 'JAPAN.mpfj' }
      ]
    });

    expect(extractReferencedMapFileNames(attrText, 'mdrj')).toEqual([
      'JAPAN.mpfj',
      '日本緯度経度.mpfj'
    ]);
  });

  it('mdrmj で mapData を内包している場合は外部地図参照を返さない', () => {
    const attrText = JSON.stringify({
      LayerData: [{ MapFileName: 'WORLD.mpfj' }],
      mapData: {
        'WORLD.mpfj': { Map: { FileName: 'WORLD.mpfj' } }
      }
    });

    expect(extractReferencedMapFileNames(attrText, 'mdrmj')).toEqual([]);
  });
});
