import React from 'react';
import { Box, Text } from 'folds';
import { useBuiltinStickerPacks } from '../../../hooks/useBuiltinStickerPacks';
import { ImageUsage } from '../../../plugins/custom-emoji';
import { SequenceCard } from '../../../components/sequence-card';
import { SequenceCardStyle } from '../styles.css';
import { SettingTile } from '../../../components/setting-tile';

export function BuiltinPacks() {
  const { packs } = useBuiltinStickerPacks(true);
  const count = packs.reduce((total, pack) => total + pack.getImages(ImageUsage.Sticker).length, 0);
  return (
    <Box direction="Column" gap="100">
      <Text size="L400">Built-in Stickers</Text>
      <SequenceCard
        className={SequenceCardStyle}
        variant="SurfaceVariant"
        direction="Column"
        gap="400"
      >
        <SettingTile
          title="Project SEKAI — 日本語"
          description={
            packs.length
              ? `${count} stickers in ${packs.length} character groups. Available in every room.`
              : 'Loading sticker catalog…'
          }
          after={
            <a href="https://sekai.best/stamp" target="_blank" rel="noreferrer">
              Sekai Viewer
            </a>
          }
        />
      </SequenceCard>
    </Box>
  );
}
