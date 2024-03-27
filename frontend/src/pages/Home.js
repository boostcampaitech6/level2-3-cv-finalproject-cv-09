import React from "react"
import PromptStart from "../components/PromptStart";
import MainNav from "../components/MainNav";
import Footer from "../components/Footer";
import '../App.css';
import './Home.css';
import Slideshow from "../components/Slideshow";
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

const Home = () =>{
  return(
      <div className="main">
        <MainNav/>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item  xs={5} lg={4} minWidth={'400px'}>
            <div className="home_column">
              <Box className="home_text1">Create Logo</Box>
              <Box className="home_text2">로고를 생성해볼까요?</Box>
              <PromptStart/>
              <Box sx={{color: "#adadad",
              marginLeft:"13px"
              }}>베타버전에서는 영문 로고만 생성할 수 있어요</Box>
            </div>
          </Grid>
          <div className="between_margin"></div>
          <Grid item >
            <Slideshow className='slideshow'/>
          </Grid>
        </Grid>
        <Footer/>
      </div>
  );
}
export default Home;