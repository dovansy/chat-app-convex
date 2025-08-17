import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useQuery } from 'convex/react';
import { useEffect, useRef } from 'react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

const ChatContent = () => {
  const { currentGroupSelect } = useChat();
  const { currentUser } = useAuth();

  const messages = useQuery(
    api.functions.messages.getMessages,
    currentGroupSelect ? { groupId: currentGroupSelect } : 'skip'
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentGroupSelect || messages?.length === 0) {
    return (
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        height='100%'
        flexDirection={'column'}
      >
        <QuestionAnswerOutlinedIcon sx={{ fontSize: 80, color: 'grey.500' }} />
        <Typography>Chat with friend</Typography>
      </Box>
    );
  }

  return (
    <Box display='flex' flexDirection='column' maxHeight='100%' p={2} gap={1.5}>
      {messages?.map((msg) => (
        <Box
          key={msg._id}
          display='flex'
          justifyContent={
            msg.senderId === currentUser._id ? 'flex-end' : 'flex-start'
          }
        >
          <Box
            sx={{
              maxWidth: '60%',
            }}
            display='flex'
            flexDirection={'column'}
          >
            {msg.senderId !== currentUser._id && (
              <Typography
                variant='caption'
                sx={{ color: 'grey.800', mb: 0.5, textAlign: 'left' }}
              >
                {msg.sender?.name || msg.sender?.email}
              </Typography>
            )}
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor:
                  msg.senderId === currentUser._id
                    ? 'success.main'
                    : 'grey.800',
                color: 'white',
                borderBottomRightRadius:
                  msg.senderId === currentUser._id ? 0 : 8,
                borderBottomLeftRadius:
                  msg.senderId === currentUser._id ? 8 : 0,
                textAlign: 'left',
              }}
            >
              {msg.text && (
                <Typography variant='body2' sx={{ mb: 0 }}>
                  {msg.text}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      ))}
      <Box height={16} display={'block'} />
      <div ref={bottomRef} />
    </Box>
  );
};

export default ChatContent;
