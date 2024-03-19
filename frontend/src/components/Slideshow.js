import Carousel from 'react-bootstrap/Carousel';
import imageData from "./assets/carousel/index";
import 'bootstrap/dist/css/bootstrap.css'; 
import './Slideshow.css';

function Slideshow() {
  return (
    <Carousel className='carousel' fade controls={false} indicators={false}>
      <Carousel.Item>
        <img className='carousel_img' label={imageData[0].label} alt={imageData[0].alt} src={imageData[0].src}/>
      </Carousel.Item>
      <Carousel.Item>
        <img className='carousel_img' label={imageData[1].label} alt={imageData[1].alt} src={imageData[1].src}/>
      </Carousel.Item>
      <Carousel.Item>
      <img className='carousel_img' label={imageData[2].label} alt={imageData[2].alt} src={imageData[2].src}/>
      </Carousel.Item>
    </Carousel>
  );
}

export default Slideshow;