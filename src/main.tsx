import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ConvexProviderWithAuth, ConvexReactClient } from 'convex/react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GroupProvider } from './context/ChatContext';
import { useConvexAuth } from './hooks/convexAuth';
import './index.css';

const theme = createTheme({
  palette: {
    primary: { main: '#22c55e' },
  },
});

const convexClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const googleClient = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={googleClient}>
    <ConvexProviderWithAuth client={convexClient} useAuth={useConvexAuth}>
      <ThemeProvider theme={theme}>
        <GroupProvider>
          <App />
        </GroupProvider>
      </ThemeProvider>
    </ConvexProviderWithAuth>
  </GoogleOAuthProvider>
);
