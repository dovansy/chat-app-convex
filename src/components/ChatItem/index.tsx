import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, IconButton, Typography } from '@mui/material';
import type { Id } from '../../../convex/_generated/dataModel';

interface ChatItemProps {
  id: Id<'groups'>;
  name: string;
  isActive: boolean;
  onSelect: (id: Id<'groups'>) => void;
  onDelete: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userProfile: any;
}

const ChatItem = ({
  id,
  name,
  isActive,
  onSelect,
  onDelete,
  userProfile,
}: ChatItemProps) => {
  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      px={2}
      py={1}
      sx={{
        backgroundColor: isActive ? '#ddd' : 'transparent',
        cursor: 'pointer',
        '&:hover': { backgroundColor: '#eee' },
        '&:hover .delete-btn': { opacity: 1 },
      }}
      onClick={() => onSelect(id)}
    >
      <Typography variant='body2' display={'flex'} sx={{ flex: 1 }}>
        {name}
      </Typography>
      {userProfile?.role === 'admin' && (
        <IconButton
          className='delete-btn'
          size='small'
          sx={{ opacity: 0, transition: 'opacity 0.2s' }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <DeleteOutlineIcon fontSize='small' />
        </IconButton>
      )}
    </Box>
  );
};

export default ChatItem;
