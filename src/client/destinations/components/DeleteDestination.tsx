/* eslint-disable react/no-multi-comp */
import React, { FunctionComponent, useState } from 'react';
import { Dialog, toaster } from 'evergreen-ui';
import { styledComponent } from '../../utils/styledComponent';
import { colors } from '../../config/styles';
import Button from '../../components/atoms/Button';
import { usePromise } from '../../utils/promise.hook';
import destinationsService from '../../services/destinations.service';

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

type DestinationType = {
  id: number;
  name: string;
};

type DeleteDestinationProps = {
  handleDelete: (data: DestinationType[]) => void;
  destinationId: number;
};

const DeleteDestination: FunctionComponent<DeleteDestinationProps> = ({
  destinationId,
  handleDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [data] = usePromise(destinationsService.get(), [], []);

  return (
    <StyledDiv>
      <Dialog
        intent="danger"
        isShown={isDeleting}
        title="Delete Destination"
        onCloseComplete={() => setIsDeleting(false)}
        onConfirm={() => {
          destinationsService.delete(destinationId).then(res => {
            setIsDeleting(false);
            toaster.success('Destination Deleted');
            // TODO: Figure out why !== breaks
            // tslint:disable-next-line: triple-equals
            const filteredOutDeleted = data.filter(item => item.id != res.id);
            handleDelete(filteredOutDeleted);
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

export default DeleteDestination;
