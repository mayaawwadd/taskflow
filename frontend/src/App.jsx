import { ThemeProvider, CssBaseline } from '@mui/material';
import { useThemeStore } from './store/themeStore';
import { getAppTheme } from './theme';
import AppRouter from './routes/AppRouter';
import { Toaster } from 'sonner';


function App() {
  const { mode } = useThemeStore();
  const theme = getAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster
        position="top-center"
        richColors
        closeButton
        theme={mode}
      />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;