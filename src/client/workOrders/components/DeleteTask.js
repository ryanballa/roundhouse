/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import { Dialog, toaster } from 'evergreen-ui';
import axios from 'axios';
import PropTypes from 'prop-types';
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
  color: colors.error,
  paddingTop: '5px',
});

const DeleteTask = ({ taskId, handleDelete }) => {
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
            .delete(`/api/v1/tasks/${taskId}`)
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
        Are you sure you want to delete this task?
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

// AddTask.propTypes = {
//   errors: PropTypes.shape({
//     car_number: PropTypes.node,
//     road: PropTypes.node,
//   }),
//   handleSubmit: PropTypes.func.isRequired,
//   isSubmitting: PropTypes.bool,
//   photos: PropTypes.arrayOf(PropTypes.object),
//   setFieldValue: PropTypes.func,
//   touched: PropTypes.shape({
//     car_number: PropTypes.bool,
//     road: PropTypes.bool,
//   }).isRequired,
//   values: PropTypes.shape(PropTypes.object),
// };

// AddTask.defaultProps = {
//   errors: {},
//   isSubmitting: false,
//   photos: [],
//   setFieldValue: () => {},
//   values: {},
// };

export default DeleteTask;
