import { globalStyle, style } from '@vanilla-extract/css';
import { color, config } from 'folds';
import buildConfig from '../../build.config';

// The wallpaper, N25 accent, glass surfaces and radii follow the Mastodon fork.
const font =
  '"IBM Plex Sans", "Noto Sans CJK JP", "Noto Sans JP", "Hiragino Sans", "PingFang SC", "Microsoft YaHei", "Segoe UI", "Helvetica Neue", var(--font-emoji), sans-serif';

export const nightcordConfig = style({
  selectors: {
    '&&': {
      vars: {
        [config.font.Inter]: font,
        [config.radii.R300]: '6px',
        [config.radii.R400]: '10px',
        [config.radii.R500]: '14px',
        [config.fontSize.T500]: '0.9375rem',
        [config.fontSize.T400]: '0.875rem',
        [config.fontSize.T300]: '0.8125rem',
        [config.fontSize.T200]: '0.75rem',
        [config.fontSize.B500]: '0.9375rem',
        [config.fontSize.B400]: '0.875rem',
        [config.fontSize.B300]: '0.8125rem',
        '--font-secondary': font,
        '--nc-font-body': font,
        '--nc-radius-sm': '6px',
        '--nc-radius-md': '10px',
        '--nc-radius-lg': '14px',
        '--nc-gap-panel': '12px',
        '--nc-panel-bg': color.Surface.Container,
        '--nc-glass-bg': color.Surface.Container,
        '--nc-panel-border': color.Surface.ContainerLine,
        '--nc-panel-shadow': '0 1px 0 rgb(255 255 255 / 4%)',
        '--nc-elevated-bg': color.Surface.Container,
        '--nc-dim': 'transparent',
      },
    },
  },
});

export const nightcordDark = style({
  selectors: {
    '&&': {
      colorScheme: 'dark',
      vars: {
        '--nc-panel-bg': 'rgb(61 54 89 / 82%)',
        '--nc-glass-bg': 'rgb(61 54 89 / 82%)',
        '--nc-panel-border': 'rgb(201 189 239 / 14%)',
        '--nc-panel-shadow': '0 1px 0 rgb(255 255 255 / 4%)',
        '--nc-elevated-bg': 'rgb(48 42 72 / 94%)',
        '--nc-dim': 'rgb(0 0 0 / 45%)',
        '--tc-link': '#c291f2',
        [color.Background.Container]: 'transparent',
        [color.Background.ContainerHover]: 'rgb(201 189 239 / 8%)',
        [color.Background.ContainerActive]: 'rgb(201 189 239 / 14%)',
        [color.Background.ContainerLine]: 'var(--nc-panel-border)',
        [color.Background.OnContainer]: '#f0ebf8',
        [color.Surface.Container]: 'var(--nc-panel-bg)',
        [color.Surface.ContainerHover]: 'rgb(201 189 239 / 8%)',
        [color.Surface.ContainerActive]: 'rgb(201 189 239 / 14%)',
        [color.Surface.ContainerLine]: 'var(--nc-panel-border)',
        [color.Surface.OnContainer]: '#f0ebf8',
        [color.SurfaceVariant.Container]: 'rgb(201 189 239 / 7%)',
        [color.SurfaceVariant.ContainerHover]: 'rgb(201 189 239 / 11%)',
        [color.SurfaceVariant.ContainerActive]: 'rgb(201 189 239 / 16%)',
        [color.SurfaceVariant.ContainerLine]: 'var(--nc-panel-border)',
        [color.SurfaceVariant.OnContainer]: '#f0ebf8',
        [color.Primary.Main]: 'color-mix(in oklab, #849 72%, #4a3d8f)',
        [color.Primary.MainHover]: 'color-mix(in oklab, #849 82%, #4a3d8f)',
        [color.Primary.MainActive]: '#794089',
        [color.Primary.MainLine]: '#a36cbb',
        [color.Primary.OnMain]: '#fff',
        [color.Primary.Container]: 'rgb(194 145 242 / 16%)',
        [color.Primary.ContainerHover]: 'rgb(194 145 242 / 22%)',
        [color.Primary.ContainerActive]: 'rgb(194 145 242 / 28%)',
        [color.Primary.ContainerLine]: 'rgb(194 145 242 / 35%)',
        [color.Primary.OnContainer]: '#d2a7f6',
        [color.Secondary.Main]: '#e7dff1',
        [color.Secondary.MainHover]: '#f0ebf8',
        [color.Secondary.MainActive]: '#fff',
        [color.Secondary.OnMain]: '#302a48',
        [color.Secondary.Container]: 'rgb(201 189 239 / 8%)',
        [color.Secondary.ContainerHover]: 'rgb(201 189 239 / 13%)',
        [color.Secondary.ContainerActive]: 'rgb(201 189 239 / 18%)',
        [color.Secondary.ContainerLine]: 'var(--nc-panel-border)',
        [color.Secondary.OnContainer]: '#f0ebf8',
        [color.Other.FocusRing]: '#c291f2',
        [color.Other.Shadow]: 'rgb(18 12 32 / 30%)',
        [color.Other.Overlay]: 'rgb(18 12 32 / 55%)',
      },
    },
  },
});

export const nightcordLight = style({
  selectors: {
    '&&': {
      colorScheme: 'light',
      vars: {
        '--nc-panel-bg': 'rgb(245 242 252 / 52%)',
        '--nc-glass-bg': 'rgb(245 242 252 / 52%)',
        '--nc-panel-border': 'rgb(91 69 122 / 18%)',
        '--nc-panel-shadow': '0 1px 0 rgb(0 0 0 / 4%)',
        '--nc-elevated-bg': 'rgb(250 248 255 / 94%)',
        '--nc-dim': 'transparent',
        '--tc-link': '#805095',
        [color.Background.Container]: 'transparent',
        [color.Background.ContainerHover]: 'rgb(91 69 122 / 7%)',
        [color.Background.ContainerActive]: 'rgb(91 69 122 / 12%)',
        [color.Background.ContainerLine]: 'var(--nc-panel-border)',
        [color.Background.OnContainer]: '#302a48',
        [color.Surface.Container]: 'var(--nc-panel-bg)',
        [color.Surface.ContainerHover]: 'rgb(91 69 122 / 6%)',
        [color.Surface.ContainerActive]: 'rgb(91 69 122 / 11%)',
        [color.Surface.ContainerLine]: 'var(--nc-panel-border)',
        [color.Surface.OnContainer]: '#302a48',
        [color.SurfaceVariant.Container]: 'rgb(255 255 255 / 28%)',
        [color.SurfaceVariant.ContainerHover]: 'rgb(91 69 122 / 8%)',
        [color.SurfaceVariant.ContainerActive]: 'rgb(91 69 122 / 13%)',
        [color.SurfaceVariant.ContainerLine]: 'var(--nc-panel-border)',
        [color.SurfaceVariant.OnContainer]: '#302a48',
        [color.Primary.Main]: 'color-mix(in oklab, #849 80%, #515297)',
        [color.Primary.MainHover]: '#754080',
        [color.Primary.MainActive]: '#663572',
        [color.Primary.MainLine]: '#a36cbb',
        [color.Primary.OnMain]: '#fff',
        [color.Primary.Container]: 'rgb(136 68 153 / 10%)',
        [color.Primary.ContainerHover]: 'rgb(136 68 153 / 16%)',
        [color.Primary.ContainerActive]: 'rgb(136 68 153 / 22%)',
        [color.Primary.ContainerLine]: 'rgb(136 68 153 / 28%)',
        [color.Primary.OnContainer]: '#744180',
        [color.Secondary.Main]: '#443853',
        [color.Secondary.MainHover]: '#302a48',
        [color.Secondary.MainActive]: '#251e34',
        [color.Secondary.OnMain]: '#faf8ff',
        [color.Secondary.Container]: 'rgb(91 69 122 / 7%)',
        [color.Secondary.ContainerHover]: 'rgb(91 69 122 / 12%)',
        [color.Secondary.ContainerActive]: 'rgb(91 69 122 / 17%)',
        [color.Secondary.ContainerLine]: 'var(--nc-panel-border)',
        [color.Secondary.OnContainer]: '#302a48',
        [color.Other.FocusRing]: '#849',
        [color.Other.Shadow]: 'rgb(48 42 72 / 15%)',
        [color.Other.Overlay]: 'rgb(48 42 72 / 35%)',
      },
    },
  },
});

export const panel = style({
  selectors: { '&&': { backgroundColor: 'var(--nc-glass-bg)' } },
  border: '1px solid var(--nc-panel-border)',
  borderRadius: 'var(--nc-radius-md)',
  boxShadow: 'var(--nc-panel-shadow)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
});

// The large modal holds separate glass panels; its border joined them with a line.
export const panelModal = style({
  selectors: {
    '&&': { background: 'transparent', border: 0, boxShadow: 'none' },
  },
});

export const shell = style({
  padding: 'var(--nc-gap-panel)',
  gap: 'var(--nc-gap-panel)',
  minWidth: 0,
  '@media': {
    'screen and (max-width: 600px)': {
      padding: '6px',
      gap: '6px',
    },
  },
});

export const roomLayout = style({
  gap: 'var(--nc-gap-panel)',
  minWidth: 0,
});

export const roomPanel = style([panel, { overflow: 'hidden', minWidth: 0 }]);

export const logo = style({ borderRadius: '50%' });

const homeIconUrl = `url("${buildConfig.base}public/res/nightcord/home.svg")`;
export const homeIcon = style({
  display: 'block',
  width: '32px',
  height: '32px',
  backgroundColor: 'currentColor',
  maskImage: homeIconUrl,
  maskRepeat: 'no-repeat',
  maskPosition: 'center',
  maskSize: 'contain',
  WebkitMaskImage: homeIconUrl,
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  WebkitMaskSize: 'contain',
});

globalStyle('html', {
  backgroundColor: '#2f2a45',
  backgroundImage: `url("${buildConfig.base}public/res/nightcord/background.webp")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
});

globalStyle('body', {
  backgroundColor: 'transparent',
  fontFamily: font,
  fontSize: '14px',
  lineHeight: 1.45,
  letterSpacing: '0.01em',
  color: color.Surface.OnContainer,
});

globalStyle('body::before', {
  content: '""',
  position: 'fixed',
  inset: 0,
  zIndex: -1,
  pointerEvents: 'none',
  background:
    'linear-gradient(var(--nc-dim), var(--nc-dim)), radial-gradient(ellipse 70% 55% at 50% 38%, transparent 32%, rgb(16 10 30 / 48%) 100%), linear-gradient(180deg, rgb(47 42 69 / 22%) 0%, transparent 30%, rgb(12 8 24 / 44%) 100%)',
});

globalStyle('body::after', {
  content: '""',
  position: 'fixed',
  inset: 0,
  zIndex: -1,
  pointerEvents: 'none',
  opacity: 0.055,
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
  backgroundSize: '180px 180px',
});

// Folds renders menus and dialogs into this shared portal without ARIA roles.
globalStyle('#portalContainer', {
  vars: {
    [color.Surface.Container]: 'var(--nc-elevated-bg)',
    '--nc-panel-bg': 'var(--nc-elevated-bg)',
  },
});

globalStyle('button, a, input, textarea', {
  transition: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease',
});

globalStyle(':focus-visible', {
  outline: `2px solid ${color.Other.FocusRing}`,
  outlineOffset: '3px',
});

globalStyle('button, input, textarea, a', {
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});
