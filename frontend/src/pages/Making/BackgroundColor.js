import React from 'react';
import { useNavigate } from "react-router";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import './SelectCard.css'
import { useUpdateItems } from '../../context';

const SelectCard =({nextNavigate, name, QuestionAbout, itemData}) => {
    const {checkItems, updateItems} = useUpdateItems();
    const navigate = useNavigate();
    const prompt = checkItems.join(', ')
    const onClickNext = () =>{
    nextNavigate !=='PromptCheck' ? navigate("/making/" + nextNavigate + "?name=" + name, {state: { name }}):
    navigate("/promptcheck?name=" + name + "?prompt="+ prompt, {state: { name, checkItems }})
    };
  return (
    <Grid container direction="row" justifyContent="center" >
        <Grid item lg={7} xs={6} alignItems="center" row={4} >
            <Box sx={{mt:8}} grid >
                <div className='Question01'>{QuestionAbout}</div>
                <ImageList cols={9} rows={9} sx={{mb:4, mt:4}}>
                {itemData.map((item) => (
                    <ImageListItem key={item.title} className="hover-image" cols={3} rows={3}>
                        <img
                            class = {item.title}
                            aria-pressed={item.clicked}
                            srcSet={item.img}
                            src={item.img}
                            alt={item.title}
                            loading="lazy"
                            onClick={(e) => {
                                updateItems(item.title);
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
        <Grid item lg={4} xs={4} row={1} ></Grid>
    </Grid>
  );
}


export default SelectCard;