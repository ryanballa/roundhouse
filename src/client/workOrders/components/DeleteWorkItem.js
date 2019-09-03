/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import { Dialog, toaster } from 'evergreen-ui';
import axios from 'axios';
import { styledComponent } from '../../utils/styledComponent';
import { colors } from '../../config/styles';
import Button from '../../components/atoms/Button';

const StyledDiv = styledComponent('div', {
  '& button': {
    marginLeft: '20px',
  },
  '& input': {
    border: '1px solid #fffcfc',
    borderRadius: '2px',
    boxShadow: '0 0 0 1px rgba(67, 90, 111, 0.14)',
    padding: '8px',
  },
  '& li': {
    display: 'inline',
    listStyle: 'none',
    marginBottom: '15px',
    marginRight: '15px',
  },
  '& ul': {
    display: 'flex',
    paddingLeft: 0,
  },
  '@media print': {
    display: 'none',
  },
  color: colors.error,
  paddingTop: '5px',
});

const DeleteWorkItem = ({ workItemId, handleDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <StyledDiv>
      <Dialog
        intent="danger"
        isShown={isDeleting}
        title="Delete Task"
        onCloseComplete={() => setIsDeleting(false)}
        onConfirm={() => {
          axios
            .delete(`/api/v1/work_items/${workItemId}`)
            .then(() => {
              setIsDeleting(false);
              toaster.success('Task Deleted');
              handleDelete();
            })
            .catch(error => {
              console.log(error);
            });
        }}
        confirmLabel="Delete"
      >
        Are you sure you want to delete this Destination?
      </Dialog>
      <Button
        icon="delete"
        onClick={() => {
          setIsDeleting(true);
        }}
        size="small"
        variant="quiet"
      >
        Delete
      </Button>
    </StyledDiv>
  );
};

export default DeleteWorkItem;
