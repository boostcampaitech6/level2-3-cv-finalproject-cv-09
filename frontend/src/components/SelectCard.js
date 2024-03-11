import React, { useState } from 'react';
import data from './SelectCard_data'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import './SelectCard.css'
// import MakingNav from './MakingNav'
import SideNavbar from './SideNavbar'
const TitlebarImageList =() => {
    const [isClicked, setClicked] = useState(false);
    const [isGrayscale, setGrayscale] = useState(false);
    const handleClick = (e) => {
        setClicked(!isClicked); // 클릭된 상태를 토글합니다.
        setGrayscale(!isClicked);
        
        // 현재 grayscale 스타일이 없거나 0%인 경우 100%로 설정, 그렇지 않으면 0%로 설정
        e.target.style.filter = isGrayscale ?'': 'grayscale(0%)';
    };
    const itemData = data
  return (
    <Grid container direction="row" justifyContent="center" >
        <Grid item sx={3}>
            {/* <MakingNav></MakingNav> */}
            <SideNavbar/>
        </Grid>
        <Grid item lg={6} xs={5} alignItems="center" >
            <Box sx={{mt:8}}>
                <div className='Question01'>1. 어떤 분야에서 사용할 로고인지 알려주세요!</div>
                <ImageList cols={3} rows={3} sx={{mb:4, mt:4}}>
                {itemData.map((item) => (
                    <ImageListItem key={item.img} className="hover-image" cols={1} rows={1}>
                        <img
                            class = {item.title}
                            srcSet={item.img}
                            src={item.img}
                            alt={item.title}
                            loading="lazy"
                            onClick={handleClick} 
                        />
                        <ImageListItemBar
                            className='img_title'
                            sx={{height: 1/4, }}
                            position='top'
                            title={item.title}
                            subtitle={item.author}
                        />
                    </ImageListItem>
                ))}
                </ImageList>
                <Grid container justifyContent="flex-end">
                <Button variant="contained" sx={{mb:2}}>
                    다음으로
                </Button>
                </Grid>
            </Box>
        </Grid>
    </Grid>
  );
}


export default TitlebarImageList;