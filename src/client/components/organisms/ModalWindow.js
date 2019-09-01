import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Button from '../atoms/Button';
import { styledComponent } from '../../utils/styledComponent';
import { colors, fontConfig, spacing } from '../../config/styles';

Modal.setAppElement('#modalElement');

const Toolbar = styledComponent('div', {
  '& h1': {
    color: colors.headers,
    fontFamily: fontConfig.familyHeaders,
    float: 'left',
  },
  display: 'flex',
  justifyContent: 'space-between',
  margin: '15px 0',
});

const Footer = styledComponent('div', {
  display: 'flex',
  justifyContent: 'flex-end',
});

const BodyContent = styledComponent('div', {
  fontFamily: fontConfig.familyBody,
});

const ModalWindow = ({ children, isModalOpen, handleModalClose, title }) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onAfterOpen={() => {}}
      onRequestClose={() => {
        handleModalClose();
      }}
      contentLabel={title}
    >
      <Toolbar>
        <h1>{title}</h1>
        <Button
          icon="close"
          type="button"
          onClick={() => {
            handleModalClose();
          }}
          variant="quiet"
        >
          Close
        </Button>
      </Toolbar>
      <BodyContent>{children}</BodyContent>
      <Footer>
        <Button
          icon="close"
          type="button"
          onClick={() => {
            handleModalClose();
          }}
          variant="quiet"
        >
          Close
        </Button>
      </Footer>
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
