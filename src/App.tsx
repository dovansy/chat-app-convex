/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Container } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useConvex, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useProfile } from './hooks/useProfile';
import ChatPage from './pages/chat';

export default function App() {
  const convex = useConvex();
  const profile = useProfile();
  const createOrUpdateUser = useMutation(
    api.functions.users.createOrUpdateUser
  );

  // const [email, setEmail] = useState<string>('');
  // const [name, setName] = useState<string>('');
  // const [, setLoading] = useState<boolean>(false);

  // const handleManualLogin = async () => {
  //   setLoading(true);
  //   try {
  //     const fakeToken = btoa(JSON.stringify({ email, name }));
  //     localStorage.setItem('idToken', fakeToken);
  //     await createOrUpdateUser();
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGoogleLogin = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    localStorage.setItem('idToken', token);

    convex.setAuth(async () => token);

    await createOrUpdateUser();
  };

  const handleLogout = () => {
    localStorage.removeItem('idToken');
    convex.setAuth(async () => null);
    window.location.reload();
  };

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      textAlign={'center'}
      // width={'100vw'}
      // height={'100vh'}
    >
      <h1>Convex + Cognito/Google POC</h1>
      <Box marginBottom={'50px'}>
        {profile ? (
          <Container>
            <Box>
              <p>Authenticated as: {profile?.email ?? 'No email'}</p>
              <Button onClick={handleLogout}>Logout</Button>
            </Box>
            <ChatPage />
          </Container>
        ) : (
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            gap={2}
          >
            {/* <Typography variant='h5' fontWeight='bold'>
              Login
            </Typography>
            <TextField
              label='Name'
              placeholder='Name'
              size='small'
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ width: '300px' }}
            />
            <TextField
              label='Email'
              placeholder='Email'
              size='small'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ width: '300px' }}
            />
            <Button
              disabled={!email}
              onClick={handleManualLogin}
              sx={{ height: '40px', color: '#fff', width: '300px' }}
              variant='contained'
            >
              Manual Login
            </Button> */}

            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                handleGoogleLogin(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
