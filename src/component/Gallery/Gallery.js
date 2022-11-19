import React from 'react'
import './Gallery.css'

const Gallery = () => {
  return (
    <>
    <div className="gallery_container pt-40">
    <div className="gallery">
        <h1>Gallery</h1>
        <p>Our showcase of works in pictures </p>
    </div>
        <div className="gallery__item mb-60">
            <img src={require('./img/amenshi4.jpg')} alt="amenshi1" className="gallery__img " />
            <img src={require('./img/amenshi8.jpg')} alt="amenshi2" className="gallery__img" />
            <img src={require('./img/amenshi3.jpg')} alt="amenshi3" className="gallery__img" />
            <img src={require('./img/amenshi16.jpg')} alt="amenshi4" className="gallery__img" />
            <img src={require('./img/amenshi11.jpg')} alt="amenshi5" className="gallery__img" />
            <img src={require('./img/amenshi18.jpg')} alt="amenshi6" className="gallery__img" />
            <img src={require('./img/amenshi2.jpg')} alt="amenshi8" className="gallery__img" />
            <img src={require('./img/amenshi9.jpg')} alt="amenshi9" className="gallery__img" />
            <img src={require('./img/amenshi1.jpg')} alt="amenshi10" className="gallery__img" />
            <img src={require('./img/amenshi5.jpg')} alt="amenshi11" className="gallery__img" />
            <img src={require('./img/amenshi12.jpg')} alt="amenshi12" className="gallery__img" />
            <img src={require('./img/amenshi13.jpg')} alt="amenshi13" className="gallery__img" />
            <img src={require('./img/amenshi14.jpg')} alt="amenshi14" className="gallery__img" />
            <img src={require('./img/amenshi10.jpg')} alt="amenshi15" className="gallery__img" />
            <img src={require('./img/amenshi15.jpg')} alt="amenshi16" className="gallery__img" />
            <img src={require('./img/amenshi17.jpg')} alt="amenshi17" className="gallery__img" />
            <img src={require('./img/amenshi18.jpg')} alt="amenshi18" className="gallery__img" />
            <img src={require('./img/amenshi19.jpg')} alt="amenshi19" className="gallery__img" />
            <img src={require('./img/amenshi20.jpg')} alt="amenshi20" className="gallery__img" />
            <img src={require('./img/amenshi21.jpg')} alt="amenshi21" className="gallery__img" />
        </div>
    </div>
    </>
  )
}

export default Gallery