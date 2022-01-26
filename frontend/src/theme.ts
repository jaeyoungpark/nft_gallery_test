import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Theme {
      palette: {
        seethru: string;
      };
    }

    interface Palette {
        neutral: Palette['primary'];
    }

    interface PaletteOptions {
        neutral: PaletteOptions['primary'];
    }
  }

const theme = createTheme({
  palette: {
    neutral: {
        main: '#cfd5dc',
        contrastText: '#fff',
    },
  },
  components: {
      MuiAppBar: {
          styleOverrides: {
              root: {
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  color: 'black',
              }
          }
      }
  }
});

export { theme };