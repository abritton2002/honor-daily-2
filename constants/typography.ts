import { StyleSheet } from 'react-native';
import colors from './colors';

// Default to dark theme for initial styling
const defaultColors = colors.dark;

export default StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: defaultColors.text.primary,
    letterSpacing: 0.25,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: defaultColors.text.primary,
    letterSpacing: 0.15,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: defaultColors.text.primary,
    letterSpacing: 0.15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: defaultColors.text.secondary,
    letterSpacing: 0.1,
  },
  body: {
    fontSize: 16,
    color: defaultColors.text.primary,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    color: defaultColors.text.secondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: defaultColors.text.muted,
    letterSpacing: 0.4,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});