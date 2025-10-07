/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const primary = '#f5c542';       
const bg = '#0b0b0b';            
const surface = '#131619';       
const surfaceAlt = '#0f1214';    
const border = '#2a2f34';        
const text = '#ECEDEE';          
const textDim = '#9BA1A6';       
const icon = '#9BA1A6';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    surface: '#f6f7f8',
    surfaceAlt: '#fff',
    border: '#e5e7eb',
    primary,
    tint: primary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primary,
  },
  dark: {
    text,
    background: bg,
    surface,
    surfaceAlt,
    border,
    primary,
    tint: primary,
    icon,
    tabIconDefault: icon,
    tabIconSelected: primary,
  },
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});