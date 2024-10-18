import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './ImageGallery.css'
import 'react-lazy-load-image-component/src/effects/blur.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  // const [showAll, setShowAll] = useState(false);
  const [imageLimit, setImageLimit] = useState(5);

  useEffect(() => {
    const cachedImages = localStorage.getItem('images');
    if (cachedImages) {
      setImages(JSON?.parse(cachedImages));
    } else {
      fetchImages();
    }
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('https://api.hotelzify.com/hotel/v1/hotel/images?id=5151')
      const data = await response.data?.data?.hotelImage
      if (data && data.length > 0) {
        setImages(data);
        localStorage.setItem('images', JSON.stringify(data));
        setImageLimit(Math.min(5, data.length));
      } else {
        setImages([]);
        setImageLimit(0);
      }
    } catch (error) {
      setImageLimit(0);
      console.error('Error fetching images:', error);
    }

  };

  const visibleImages = images?.slice(0, imageLimit);

  return (
    <>
     <>
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
      {images.length === 0 ? ( 
        <div className="no-images">
          <p>No images available.</p>
        </div>
      ) : visibleImages.length === 1 ? (
        <div className="full-width">
          <img src={images[0]} alt="Primary" effect="blur" />
        </div>
      ) : (
        <>
          <div className="left primary-image">
            <img src={images[0]} alt="Primary" effect="blur" />
          </div>
          <div className="right secondary-images">
            <div className="grid">
              {visibleImages.slice(1).map((img, idx) => (
                <LazyLoadImage key={idx} src={img} alt={`Image ${idx + 2}`} effect="blur" />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  </>

    </>
  );
};

export default ImageGallery;
