import type { MatrixClient } from 'matrix-js-sdk/lib/client';
import buildConfig from '../../build.config';
import { ImagePack, ImageUsage, PackImages } from '../app/plugins/custom-emoji';
import { mxcUrlToHttp } from '../app/utils/matrix';

type SekaiSticker = {
  id: number;
  asset: string;
  name: string;
  characterId: number;
  file: string;
  w: number;
  h: number;
  size: number;
  mimetype: string;
};
type SekaiCatalog = {
  regions: {
    id: string;
    name: string;
    characters: { id: number; firstName?: string; givenName: string }[];
    stickers: SekaiSticker[];
  }[];
};

const assets = new Map<string, SekaiSticker>();
let packPromise: Promise<ImagePack[]> | undefined;
const uploads = new WeakMap<MatrixClient, Map<string, Promise<string>>>();

export const getBuiltinSticker = (url: string): SekaiSticker | undefined => assets.get(url);

// Only catalogued local images bypass Matrix's MXC resolver.
export const resolveStickerUrl = (
  mx: MatrixClient,
  url: string,
  useAuthentication?: boolean
): string | null => (getBuiltinSticker(url) ? url : mxcUrlToHttp(mx, url, useAuthentication));

export const loadBuiltinStickerPacks = (): Promise<ImagePack[]> => {
  if (!packPromise) {
    packPromise = import('./sekai-stickers.json')
      .then(({ default: data }) => {
        const catalog = data as SekaiCatalog;
        return catalog.regions.flatMap((region) => {
          const groups = new Map<number, PackImages>();
          region.stickers.forEach((sticker) => {
            const url = `${buildConfig.base}public/stickers/sekai/${sticker.file}`;
            assets.set(url, sticker);
            const images = groups.get(sticker.characterId) ?? {};
            images[`sekai_jp_${String(sticker.id).padStart(4, '0')}`] = {
              url,
              body: sticker.name,
              usage: [ImageUsage.Sticker],
              info: { w: sticker.w, h: sticker.h, size: sticker.size, mimetype: sticker.mimetype },
            };
            groups.set(sticker.characterId, images);
          });
          return Array.from(groups, ([characterId, images]) => {
            const character = region.characters.find((item) => item.id === characterId);
            const name = character
              ? `${character.firstName ?? ''}${character.givenName}`.trim()
              : 'その他';
            return new ImagePack(
              `nightcord-sekai-${region.id}-${characterId}`,
              {
                pack: {
                  display_name: `SEKAI · ${name}`,
                  attribution:
                    'Project SEKAI / SEGA / Colorful Palette / Crypton Future Media · https://sekai.best/stamp',
                  usage: [ImageUsage.Sticker],
                },
                images,
              },
              undefined
            );
          });
        });
      })
      .catch((error) => {
        packPromise = undefined;
        throw error;
      });
  }
  return packPromise;
};

export const uploadBuiltinSticker = (mx: MatrixClient, url: string): Promise<string> => {
  const sticker = getBuiltinSticker(url);
  if (!sticker) return Promise.reject(new Error('Unknown built-in sticker'));
  let clientUploads = uploads.get(mx);
  if (!clientUploads) {
    clientUploads = new Map();
    uploads.set(mx, clientUploads);
  }
  const cached = clientUploads.get(url);
  if (cached) return cached;
  const cache = clientUploads;
  const pending = fetch(url)
    .then(async (response) => {
      if (!response.ok) throw new Error('Could not load the sticker image');
      const image = await response.blob();
      if (image.size !== sticker.size) throw new Error('The sticker image is incomplete');
      const result = await mx.uploadContent(image, {
        name: `${sticker.asset}.${sticker.file.split('.').pop()}`,
        type: sticker.mimetype,
      });
      return result.content_uri;
    })
    .catch((error) => {
      cache.delete(url);
      throw error;
    });
  cache.set(url, pending);
  return pending;
};
