import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '../convex/_generated/api';
import { useAuth } from './context/AuthContext';
import ChatPage from './pages/chat';

export default function App() {
  const { currentUser, loginUser } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const profile = useQuery(api.functions.getProfile.getProfile);
  const ensureUser = useMutation(api.functions.users.ensureUser);
  const createUser = useMutation(api.functions.users.createUser);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const run = async () => {
      if (profile?.email) {
        const id = await ensureUser();
        loginUser(id);
      }
    };
    run();
  }, [ensureUser, loginUser, profile]);

  const handleCreate = async () => {
    setLoading(true);
    await createUser({
      name: name,
      email: email,
      externalId: crypto.randomUUID(),
    })
      .then((res) => {
        loginUser(res);
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
        {profile === undefined ? (
          <p>Loading profile...</p>
        ) : profile || currentUser ? (
          <Container>
            <p>Authenticated as: {profile?.email || currentUser.email}</p>
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
          </Box>
        )}
      </Box>
    </Box>
  );
}
