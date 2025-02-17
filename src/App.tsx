import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from 'store';
import theme from 'theme';
import NotificationProvider from 'components/NotificationProvider';
import GlobalStylesDefinition from 'theme/GlobalStylesDefinition';
import Layout from './components/Layout';
import Main from 'views/Main';
import WithAuth from 'components/WithAuth';
import { SWRConfig } from 'swr';
import config from 'config';
import LoginScreen from 'components/LoginScreen';


function App() {
  return (
    <Provider store={store}>
      <SWRConfig value={config.swrConfig}>
        <NotificationProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStylesDefinition />
            <Layout>
              <WithAuth splashScreen={<LoginScreen />}>
                <Main />
              </WithAuth>
            </Layout>
          </ThemeProvider>
        </NotificationProvider>
      </SWRConfig>
    </Provider>
  )
}

export default App;
