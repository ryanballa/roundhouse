import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Button from '../atoms/Button';
import { styledComponent } from '../../utils/styledComponent';

Modal.setAppElement('#modalElement');

const Toolbar = styledComponent('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  margin: '15px 0',
});

const ModalWindow = ({ children, isModalOpen, handleModalClose }) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onAfterOpen={() => {}}
      onRequestClose={() => {
        handleModalClose();
      }}
      contentLabel="Example Modal"
    >
      <Toolbar>
        <Button
          icon="close"
          type="button"
          onClick={() => {
            handleModalClose();
          }}
          variant="secondary"
        >
          Close
        </Button>
      </Toolbar>
      {children}
      <Toolbar>
        <Button
          icon="close"
          type="button"
          onClick={() => {
            handleModalClose();
          }}
          variant="secondary"
        >
          Close
        </Button>
      </Toolbar>
    </Modal>
  );
};

ModalWindow.propTypes = {
  children: PropTypes.node.isRequired,
  handleModalClose: PropTypes.func,
  isModalOpen: PropTypes.bool,
};

ModalWindow.defaultProps = {
  handleModalClose: () => {},
  isModalOpen: false,
};

export default ModalWindow;
