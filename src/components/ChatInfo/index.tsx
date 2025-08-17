import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useChat } from '../../context/ChatContext';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const ChatInfo = () => {
  const { currentGroupSelect } = useChat();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentChat: any = useQuery(
    api.functions.groups.getGroupByKey,
    currentGroupSelect ? { groupId: currentGroupSelect } : 'skip'
  );

  return (
    <Box
      height={50}
      px={2}
      display='flex'
      alignItems='center'
      bgcolor='white'
      borderBottom='1px solid #e0e0e0'
    >
      {currentChat ? (
        <>
          <Avatar
            src={currentChat?.avatar}
            alt={currentChat?.name}
            sx={{ width: 32, height: 32, mr: 2 }}
          />
          <Typography variant='subtitle1' fontWeight={500}>
            {currentChat?.name}
          </Typography>
        </>
      ) : (
        <Typography variant='body2' fontStyle='italic' color='text.secondary'>
          Choose a chat to start messaging
        </Typography>
      )}
    </Box>
  );
};

export default ChatInfo;
