import React from 'react';
import { ThemeProvider } from '@emotion/react';

import { AuthProvider } from './context/AuthProvider';
import { AwsProvider } from './context/AwsProvider';
import { theme } from './theme.ts'
import Main from './Main';

console.log(theme);
function App() {
  return (
    <AuthProvider>
      <AwsProvider>
        <ThemeProvider theme={theme}>
          <Main />
        </ThemeProvider>
      </AwsProvider>
    </AuthProvider>
  );
}

export default App;
