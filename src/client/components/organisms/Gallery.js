import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toaster } from 'evergreen-ui';
import { styledComponent } from '../../utils/styledComponent';
import { colors } from '../../config/styles';
import ModalWindow from './ModalWindow';
import Button from '../atoms/Button';

const LargeImage = styledComponent('div', {
  '& .largePhoto': {
    maxWidth: '900px',
  },
  textAlign: 'center',
});

const StyledGallery = styledComponent('div', {
  '& button': {
    height: 'fit-content',
    marginLeft: '15px',
  },
  '& div': {
    alignItems: 'center',
    display: 'flex',
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

const Gallery = ({ canDelete, canSelect, handleSelection, photos, title }) => {
  const [openModal, setOpenModal] = useState(null);
  return (
    <StyledGallery className="gallery">
      {title && <h2>{title}</h2>}
      {photos.map((photo, i) => (
        <div className="photoWrapper" key={photo.id}>
          <StyledGalleryImg
            className={canDelete ? 'deleteable' : ''}
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
              <LargeImage>
                <img className="largePhoto" src={photo.path} alt="" />
              </LargeImage>
            </ModalWindow>
            {canDelete && (
              <Button
                onClick={() => {
                  handleSelection({ id: photo.id, path: photo.path });
                }}
                icon="delete"
                variant="quiet"
              >
                Delete
              </Button>
            )}
          </StyledGalleryImg>

          {canSelect && (
            <Button
              onClick={() => {
                toaster.success('Photo Selected');
                handleSelection({ id: photo.id, path: photo.path });
              }}
              icon="add"
              size="small"
              type="Button"
              variant="secondary"
            >
              Use
            </Button>
          )}
        </div>
      ))}
    </StyledGallery>
  );
};

Gallery.propTypes = {
  canDelete: PropTypes.bool,
  canSelect: PropTypes.bool,
  handleSelection: PropTypes.func,
  photos: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};

Gallery.defaultProps = {
  canDelete: false,
  canSelect: false,
  handleSelection: () => {},
  photos: [],
  title: null,
};

export default Gallery;
