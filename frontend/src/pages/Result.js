import { useLocation } from "react-router";
import MainNav from "../components/MainNav";
import Loading from "../components/Loading";
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Footer from "../components/Footer";
import './Result.css';
import loading from '../components/assets/loading.avif'

const Makedlogo = () =>{
  let location = useLocation();
  const taskid = location.state?.taskid;
  const [loading, setLoading] = useState(true);
  const [ckresult, setCkresult] = useState('not');

  const [ismodalopen, setIsmodalopen] = useState(false);
  const openModal = () => setIsmodalopen(true);
  const closeModal = () => setIsmodalopen(false);

  useEffect( () => {
    let timer = setTimeout( () => {get_image()}, 5000);
    return () => {clearTimeout(timer)}
  }, [ckresult])

  const downloadImage = (imageUrl) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = 'image.png'; // 다운로드될 파일명
    downloadLink.target = "_blank"
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    openModal();
  }

  const get_image = () => {
    console.log('get image call')
    console.log(typeof taskid)
    console.log(taskid)
    axios.post('/api/get_image/',
    {
      dp_id: taskid[0],
      td_id: taskid[1],
      sd2_id: taskid[2],
      sdxl_id: taskid[3],
    } )
    .then((response)=>{
      console.log('get image call success')
      console.log(response.data.status)
      if (response.data.status === "SUCCESS"){
      Index?.map((Index, key) => (
        Index.imgurl = response.data.result[key]
      ))
      setLoading(false)
      if(ckresult ==='not'){
        setCkresult("end");
        console.log(ckresult);
      }
      else if(ckresult ==='yet'){
        setCkresult("end");
        console.log(ckresult);
      }
      console.log(ckresult);
    }
    else if(ckresult ==='not'){
      setCkresult("yet");
      console.log(ckresult);
    }
    else if(ckresult ==='yet'){
      setCkresult("not");
      console.log(ckresult);
    }
  })
    .catch((error)=>{
      console.log('요청실패')
      console.log(error)
  })
  }
  const [Index, setIndex] = useState([
    {id: 0, title: 'image01', imgurl:loading},
    {id: 1, title: 'image02', imgurl:loading},
    {id: 2, title: 'image03', imgurl:loading},
    {id: 3, title: 'image04', imgurl:loading},
  ]);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
  };
return(
    <div >
        <MainNav/>
        {loading ? (<Loading/>) :(
        <div className='container box'>
          <Modal
            open={ismodalopen}
            onClose={closeModal}
            ><Box sx={style}>
            <div>생성된 로고가 마음에 드시나요?</div>
            <div>더 나은 서비스를 위한 설문에 참여해주세요!</div>
            <a href="https://www.naver.com" target="_blank">설문참여</a>
            </Box>
            </Modal>
          <Grid container direction="row" justifyContent="center" >
        <Grid item lg={7} xs={6} alignItems="center" row={4} >
          <Box sx={{mt:8}} grid >
                <ImageList cols={4} rows={4} sx={{mb:4, mt:4}}>
                {Index.map((Index) => (
                    <ImageListItem  className="hover-image" cols={2} rows={2}>
                        <img
                            srcSet={Index.imgurl}
                            src={Index.imgurl}
                            loading="lazy"
                            // onMouseEnter = {(e)=>checkItems.includes(item.title)?'none':e.target.style.filter='grayscale(0%)'}
                            // onMouseLeave={(e) => checkItems.includes(item.title)? 'none':e.target.style.filter = 'grayscale(100%)'}
                            // style ={{filter: checkItems.includes(item.title) ? 'grayscale(0%)' : 'grayscale(100%)'}}
                        />
                        <ImageListItemBar
                            className='img_title'
                            sx={{height: 1/8, }}
                            position='top'
                            title='download'
                            onClick={(e) => {
                              downloadImage(Index.imgurl);
                              }}
                        />
                    </ImageListItem>
                ))}
                </ImageList>
            </Box>
            </Grid>
            </Grid>
    </div>)}
    <Footer/>
    </div>
    
)
}
export default Makedlogo;