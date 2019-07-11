import React from 'react';
import PropTypes from 'prop-types';
import { styledComponent } from '../../utils/styledComponent';

const StyledGallery = styledComponent('div', {
  '& div': {
    display: 'inline',
    margin: '20px',
  },
  width: '50%',
});

const StyledGalleryImg = styledComponent('div', {
  '& img': {
    border: '1px solid #d2d2d2',
    borderRadius: '4px',
    padding: '10px',
  },
  height: '100px',
  width: '100px',
});

const Gallery = ({ handleSelection, photos }) => (
  <StyledGallery>
    <h2>Select a Photo</h2>
    {photos.map(photo => (
      <StyledGalleryImg
        key={photo.id}
        onClick={() => handleSelection(photo.path)}
      >
        <img src={photo.path} width="100" alt="" />
      </StyledGalleryImg>
    ))}
  </StyledGallery>
);

Gallery.propTypes = {
  handleSelection: PropTypes.func,
  photos: PropTypes.arrayOf(PropTypes.object),
};

Gallery.defaultProps = {
  handleSelection: () => {},
  photos: [],
};

export default Gallery;
