import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './ImageGallery.css';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [imageLimit, setImageLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cachedImages = localStorage.getItem('images');
    if (cachedImages) {
      setImages(JSON.parse(cachedImages));
      setLoading(false);
    } else {
      fetchImages();
    }
  }, []);

  const renderImage = (img, idx) => {
    const props = {
      key: idx,
      src: img,
      alt: `Image ${idx + 2}`,
      className: [2, 3].includes(visibleImages.length) || 
                 (visibleImages.length === 4 && idx === 0) ? "full-width" : "",
      effect: visibleImages.length > 4 ? "blur" : undefined
    };

    return <LazyLoadImage {...props} />;
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.hotelzify.com/hotel/v1/hotel/images?id=5151');
      const data = response.data?.data?.hotelImage || [];
      setImages(data);
      localStorage.setItem('images', JSON.stringify(data));
      setImageLimit(Math.min(5, data.length));
    } catch (error) {
      setError('Error fetching images. Please try again later.');
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const visibleImages = images.slice(0, imageLimit);

  return (
    <div>
      <div className="slider-container">
        <label htmlFor="imageLimit">Number of Images to Display: {imageLimit}</label>
        <input
          type="range"
          id="imageLimit"
          min="1"
          max={images.length}
          value={imageLimit}
          onChange={(e) => setImageLimit(parseInt(e.target.value))}
          disabled={images.length === 0}
        />
      </div>

      <div className="gallery">
        {loading ? (
          <div>Loading images...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : images.length === 0 ? (
          <div className="no-images">
            <p>No images available.</p>
          </div>
        ) : visibleImages.length === 1 ? (
          <div className="full-width">
            <LazyLoadImage src={images[0]} alt="Primary" />
          </div>
        ) : (
          <>
            <div className="left primary-image">
              <LazyLoadImage src={images[0]} alt="Primary" />
            </div>
            <div className="secondary-images">
              <div className="grid">
                {visibleImages.slice(1).map(renderImage)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
