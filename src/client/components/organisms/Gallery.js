import React from 'react';
import PropTypes from 'prop-types';
import { styledComponent } from '../../utils/styledComponent';
import { colors } from '../../config/styles';

const StyledGallery = styledComponent('div', {
  '& div': {
    display: 'inline',
    margin: '20px',
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
      backgroundColor: colors.error,
    },
    cursor: 'pointer',
  },
  height: '100px',
  width: '100px',
});

const Gallery = ({ canDelete, handleSelection, photos, title }) => (
  <StyledGallery>
    {title && <h2>{title}</h2>}
    {photos.map(photo => (
      <StyledGalleryImg
        className={canDelete ? 'deleteable' : ''}
        key={photo.id}
        onClick={() => handleSelection({ id: photo.id, path: photo.path })}
      >
        <img src={photo.path} width="100" alt="" />
      </StyledGalleryImg>
    ))}
  </StyledGallery>
);

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
