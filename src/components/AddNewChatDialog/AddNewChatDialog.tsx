import { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';

interface AddChatDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

const AddNewChatDialog = ({
  open,
  loading,
  onClose,
  onAdd,
}: AddChatDialogProps) => {
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Group Chat</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Group name'
          type='text'
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          loading={loading}
          loadingPosition='end'
          disabled={!name}
          variant='contained'
          sx={{
            color: '#fff',
          }}
          onClick={() => {
            handleAdd();
            onClose();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewChatDialog;
