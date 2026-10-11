import { useCallback, useEffect, useState } from 'react';
import { ImagePack } from '../plugins/custom-emoji';
import { loadBuiltinStickerPacks } from '../../nightcord/stickers';

export function useBuiltinStickerPacks(enabled: boolean) {
  const [packs, setPacks] = useState<ImagePack[]>([]);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  useEffect(() => {
    if (!enabled) return undefined;
    let active = true;
    setFailed(false);
    loadBuiltinStickerPacks().then(
      (result) => {
        if (active) {
          setPacks(result);
        }
      },
      () => {
        if (active) {
          setFailed(true);
        }
      }
    );
    return () => {
      active = false;
    };
  }, [enabled, attempt]);
  return { packs, failed, retry };
}
