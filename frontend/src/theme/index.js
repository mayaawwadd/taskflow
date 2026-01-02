import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

export const getAppTheme = (mode) => {
    return mode === 'light' ? lightTheme : darkTheme;
};