import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Button from '../atoms/Button';
import { styledComponent } from '../../utils/styledComponent';
import { colors, fontConfig } from '../../config/styles';

if (process.env.NODE_ENV !== 'test') {
  Modal.setAppElement('#modalElement');
}

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

const ModalWindow = ({
  children,
  isModalOpen,
  handleModalClose,
  showBottomClose,
  style,
  title,
}) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onAfterOpen={() => {}}
      onRequestClose={() => {
        handleModalClose();
      }}
      contentLabel={title}
      style={style}
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
      {showBottomClose && (
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
      )}
    </Modal>
  );
};

ModalWindow.propTypes = {
  children: PropTypes.node.isRequired,
  handleModalClose: PropTypes.func,
  isModalOpen: PropTypes.bool,
  showBottomClose: PropTypes.bool,
  style: PropTypes.shape({}),
  title: PropTypes.string,
};

ModalWindow.defaultProps = {
  handleModalClose: () => {},
  isModalOpen: false,
  showBottomClose: false,
  style: {},
  title: '',
};

export default ModalWindow;
