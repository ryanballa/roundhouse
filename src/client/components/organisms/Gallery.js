import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styledComponent } from '../../utils/styledComponent';
import { colors } from '../../config/styles';
import ModalWindow from './ModalWindow';
import Button from '../atoms/Button';

const StyledGallery = styledComponent('div', {
  '& div': {
    display: 'inline',
    margin: '20px',
    marginLeft: 0,
  },
  '& h2': {
    color: colors.headers,
  },
  width: '50%',
});

const StyledGalleryImg = styledComponent('div', {
  '& img': {
    border: '1px solid #d2d2d2',
    borderRadius: '4px',
    padding: '10px',
  },
  '&.deleteable:hover': {
    '& img': {
      backgroundColor: colors.menu.active,
    },
    cursor: 'pointer',
  },
  height: '100px',
  width: '100px',
});

const Gallery = ({ canDelete, handleSelection, photos, title }) => {
  const [openModal, setOpenModal] = useState(null);
  return (
    <StyledGallery>
      {title && <h2>{title}</h2>}
      {photos.map((photo, i) => (
        <div>
          <StyledGalleryImg
            className={canDelete ? 'deleteable' : ''}
            key={photo.id}
            onClick={() => {
              if (openModal === null) {
                setOpenModal(i);
              }
            }}
          >
            <img src={photo.path} width="100" alt="" />
            <ModalWindow
              isModalOpen={openModal === i}
              handleModalClose={() => {
                setOpenModal(null);
              }}
            >
              <img src={photo.path} alt="" />
            </ModalWindow>
            {/* <Modal
            isOpen={openModal === i}
            onAfterOpen={() => {}}
            onRequestClose={() => {
              console.log('Close Modal');
              setOpenModal(null);
            }}
            contentLabel="Example Modal"
          >
            <img src={photo.path} alt="" />
            <button
              type="button"
              onClick={() => {
                setOpenModal(null);
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x-square"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="15" />
                <line x1="15" y1="9" x2="9" y2="15" />
              </svg>
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                handleSelection({ id: photo.id, path: photo.path });
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-trash-2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              Delete
            </button>
          </Modal> */}
          </StyledGalleryImg>
          {canDelete && (
            <Button
              onClick={() => {
                handleSelection({ id: photo.id, path: photo.path });
              }}
              icon="delete"
              variant="secondary"
            >
              Delete
            </Button>
          )}
        </div>
      ))}
    </StyledGallery>
  );
};

Gallery.propTypes = {
  canDelete: PropTypes.bool,
  handleSelection: PropTypes.func,
  photos: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};

Gallery.defaultProps = {
  canDelete: false,
  handleSelection: () => {},
  photos: [],
  title: null,
};

export default Gallery;
