import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { api } from '../convex/_generated/api';
import { useAuth } from './context/AuthContext';
import ChatPage from './pages/chat';
import { GoogleLogin } from '@react-oauth/google';

export default function App() {
  const { currentUser, loginUser, logout } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  // const ensureUser = useMutation(api.functions.users.ensureUser);
  const createUser = useMutation(api.functions.users.createUser);
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   const run = async () => {
  //     if (profile?.email) {
  //       const id = await ensureUser();
  //       loginUser(id);
  //     }
  //   };
  //   run();
  // }, [ensureUser, loginUser, profile]);

  const handleCreate = async () => {
    setLoading(true);
    await createUser({
      name: name,
      email: email,
      externalId: crypto.randomUUID(),
    })
      .then((res) => {
        loginUser(res);
        localStorage.setItem('idToken', email);
      })
      .finally(() => setLoading(false));
  };
  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      textAlign={'center'}
      width={'100vw'}
      height={'100vh'}
    >
      <h1>Convex + Cognito POC</h1>
      <Box marginBottom={'50px'}>
        {currentUser === undefined ? (
          <p>Loading profile...</p>
        ) : currentUser ? (
          <Container>
            <Box>
              <p>Authenticated as: {currentUser?.email}</p>
              <Button
                onClick={() => {
                  localStorage.removeItem('idToken');
                  localStorage.removeItem('user');
                  logout();
                }}
              >
                Logout
              </Button>
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
            <Typography variant='h5' fontWeight='bold'>
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
              loading={loading}
              loadingPosition='end'
              onClick={handleCreate}
              sx={{ height: '40px', color: '#fff', width: '300px' }}
              variant='contained'
            >
              Login
            </Button>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap
            />
            ;
          </Box>
        )}
      </Box>
    </Box>
  );
}
