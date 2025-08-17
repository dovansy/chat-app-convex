import Box from '@mui/material/Box';
import ChatContent from '../../components/ChatContent';
import ChatInfo from '../../components/ChatInfo';
import ChatInput from '../../components/ChatInput';
import ChatList from '../../components/ChatList';

const ChatPage = () => {
  return (
    <Box
      borderRadius={'16px'}
      height={'80vh'}
      border={'1px solid #000'}
      display={'flex'}
      flex={1}
      overflow={'hidden'}
    >
      {/* Sidebar */}
      <Box className='w-[200px] bg-[#f5f5f5] border-r overflow-y-auto'>
        <ChatList />
      </Box>
      {/* Chat Area */}
      <Box className='flex flex-col flex-1'>
        <Box className='px-4 py-2 border-b'>
          <ChatInfo />
        </Box>
        <Box className='flex-1 px-4 py-2 overflow-y-auto'>
          <ChatContent />
        </Box>
        <Box className='px-4 py-2 border-t'>
          <ChatInput />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
