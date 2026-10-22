import { Platform } from 'react-native';

export const colors = {
  background: '#F6F3EC',
  surface: '#FFFDFA',
  text: '#292A25',
  muted: '#69695F',
  primary: '#A33E24',
  soft: '#EFE5D7',
  border: '#DAD5C9',
  error: '#9B392A',
};

export const headingFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });
