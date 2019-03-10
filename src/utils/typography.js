import Typography from 'typography';
import theme from 'typography-theme-ocean-beach';

import './global.css';

theme.overrideThemeStyles = () => ({
  a: {
    backgroundImage: 'none',
    color: 'var(--textLink)',
    textDecoration: 'underline',
    textShadow: 'none',
  },
  blockquote: {
    color: 'inherit',
    borderLeftColor: 'inherit',
    opacity: '0.8',
  },
  h2: {
    color: 'var(--textTitle)',
  },
  hr: {
    background: 'var(--hr)',
  },
});

const typography = new Typography(theme);

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
