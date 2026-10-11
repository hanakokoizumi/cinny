export enum EmojiBoardTab {
  Emoji = 'Emoji',
  Sticker = 'Sticker',
  SekaiSticker = 'SekaiSticker',
}

export enum EmojiType {
  Emoji = 'emoji',
  CustomEmoji = 'customEmoji',
  Sticker = 'sticker',
}

export type EmojiItemInfo = {
  type: EmojiType;
  data: string;
  shortcode: string;
  label: string;
};
