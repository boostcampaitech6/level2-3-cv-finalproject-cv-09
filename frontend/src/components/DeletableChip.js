import React from 'react';
import Chip from '@mui/material/Chip';
// import Stack from '@mui/material/Stack';

export default function DeletableChips(e) {
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return (
    // <Stack direction="column" spacing={1}>
      <Chip label={e} variant="outlined" onDelete={handleDelete} />
    // </Stack>
  );
}