import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import data from '../../components/SelectCard_data/Purpose_SelectCard_data'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import './SelectCard.css'

const Purpose = ({clickedCheck, handleSingleCheck, name}) => {

  useEffect( () => {
    itemData?.map((itemData, key) => (
      itemData.clicked=clickedCheck(itemData.title)
    ))
    forceUpdate();
  },[]);
  const [,updateState]=useState();
  const forceUpdate = useCallback(()=>updateState({}),[]);
  const itemData = data
  const navigate = useNavigate();
  const onClickNext = () =>{
    navigate("/making/fontcolor?name=" + name, {state: { name }});
  }
      return(
        <Grid container direction="row" justifyContent="center" >
        <Grid item sx={3}>
        </Grid>
        <Grid item lg={6} xs={5} alignItems="center" >
            <Box sx={{mt:8}}>
                <div className='Question01'>목적을 알려주세요.</div>
                <ImageList cols={3} rows={3} sx={{mb:4, mt:4}}>
                {itemData.map((item) => (
                    <ImageListItem key={item.img} className="hover-image" cols={1} rows={1}>
                        <img
                            class = {item.title}
                            aria-pressed={item.clicked}
                            srcSet={item.img}
                            src={item.img}
                            alt={item.title}
                            loading="lazy"
                            onClick={(e) => {
                                handleSingleCheck(item.title);
                                item.clicked=!item.clicked;
                              }}
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
                <Button onClick={onClickNext} variant="contained" sx={{mb:2}}>
                    다음으로
                </Button>
                </Grid>
            </Box>
        </Grid>
    </Grid>
        
        );
    }
        
export default Purpose;

