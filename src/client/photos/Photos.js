import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, toaster } from 'evergreen-ui';
import axios from 'axios';
import Button from '../components/atoms/Button';
import SingleColumn from '../components/layout/SingleColumn';
import ZeroState from '../components/atoms/ZeroState';
import { styledComponent } from '../utils/styledComponent';
import Gallery from '../components/organisms/Gallery';

const StyledDiv = styledComponent('div', {
  '& .photoWrapper': {
    display: 'inline-block',
  },
  '& .photoWrapper > div': {
    display: 'inline-block',
  },
  '& > div': {
    width: '100%',
  },
  display: 'flex',
});

function Photos({ history }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await axios(`/api/v1/photos/`).then(photosRes => {
        setPhotos(photosRes.data);
        setIsLoading(false);
      });
    };
    fetchData();
  }, []);

  return (
    <SingleColumn history={history}>
      <Dialog
        intent="danger"
        isShown={isDeleting}
        title="Delete Photo"
        onCloseComplete={() => setIsDeleting(false)}
        onConfirm={() => {
          axios
            .delete(`/api/v1/photos/${photoToDelete}`)
            .then(() => {
              const newPhotos = photos.filter(
                photo => photo.id !== photoToDelete,
              );
              setPhotos(newPhotos);
              setIsDeleting(false);
              setPhotoToDelete(null);
              toaster.success('Photo Deleted');
              history.push('/photos');
            })
            .catch(error => {
              console.log(error);
            });
        }}
        confirmLabel="Delete"
      >
        Are you sure you want to delete {photoToDelete} ?
      </Dialog>
      <h1>Photos</h1>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <StyledDiv>
          {photos.length === 0 && (
            <ZeroState entity="photo" to="/photos/upload">
              <p>Add a photo to begin building a record of your collection.</p>
            </ZeroState>
          )}
          {photos.length > 0 && (
            <Gallery
              canDelete
              handleSelection={value => {
                setPhotoToDelete(value.id);
                setIsDeleting(true);
              }}
              photos={photos}
            />
          )}
        </StyledDiv>
      )}
      {photos.length > 0 && (
        <Button
          icon="add"
          onClick={() => {
            history.push('/photos/upload');
          }}
        >
          Add Photo
        </Button>
      )}
    </SingleColumn>
  );
}

Photos.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Photos;
