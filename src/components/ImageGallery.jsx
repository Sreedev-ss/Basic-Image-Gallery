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
    const response = await axios.get('https://api.hotelzify.com/hotel/v1/hotel/images?id=5151')
    const data = await response.data?.data?.hotelImage
    console.log(data)
    setImages(data);
    localStorage.setItem('images', JSON.stringify(data));
    setImageLimit(Math.min(5, data.length));
  };

  const visibleImages = images.slice(0, imageLimit); 

  return (
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
          />
        </div>
      <div className="gallery">
        {visibleImages.length === 1 ? (
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
      {/* {images.length > 5 && !showAll && (
        <button onClick={() => setShowAll(true)}>View More</button>
      )} */}

    </>
  );
};

export default ImageGallery;
