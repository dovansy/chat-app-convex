import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useChat } from '../../context/ChatContext';
import AddNewChatDialog from '../AddNewChatDialog/AddNewChatDialog';
import ChatItem from '../ChatItem';

const ChatList = () => {
  const groups = useQuery(api.functions.groups.listGroups) || [];
  const createGroup = useMutation(api.functions.groups.createGroup);
  // const joinGroup = useMutation(api.functions.groups.joinGroup);
  const profile = useQuery(api.functions.getProfile.getProfile);
  const userProfile = useQuery(api.functions.getProfile.getUserByEmail, {
    email: profile?.email ?? '',
  });
  const deleteGroup = useMutation(api.functions.groups.deleteGroup);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async (groupId: Id<'groups'>) => {
    try {
      await deleteGroup({ groupId });
    } catch (err) {
      console.error(err);
    }
  };

  const { currentGroupSelect, setCurrentGroupSelect } = useChat();
  const [open, setOpen] = useState(false);

  const handleAddChat = async (name: string) => {
    try {
      setLoading(true);
      const groupId = crypto.randomUUID();
      const res = await createGroup({
        name: name,
        groupId: groupId,
      });

      setCurrentGroupSelect(res);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display='flex' flexDirection='column' height='100%'>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        px={2}
        height={'51px'}
        borderBottom='1px solid #000'
        bgcolor='#fafafa'
      >
        <Typography variant='subtitle1' fontWeight={600}>
          {`Chat${groups.length > 1 ? 's' : ''} (${groups.length})`}
        </Typography>
        {userProfile?.role === 'admin' && (
          <Button
            size='small'
            variant='contained'
            onClick={() => setOpen(true)}
          >
            <AddIcon sx={{ fontSize: 20 }} />
          </Button>
        )}
      </Box>

      <Box flex={1} sx={{ overflowY: 'auto' }}>
        {groups.map((item) => (
          <ChatItem
            key={item._id}
            id={item._id}
            name={item.name}
            isActive={currentGroupSelect === item._id}
            onSelect={setCurrentGroupSelect}
            onDelete={() => handleDelete(item._id)}
            userProfile={userProfile}
          />
        ))}
      </Box>

      {/* Add Chat Dialog */}
      {userProfile?.role === 'admin' && (
        <AddNewChatDialog
          loading={loading}
          open={open}
          onClose={() => setOpen(false)}
          onAdd={handleAddChat}
        />
      )}
    </Box>
  );
};

export default ChatList;
