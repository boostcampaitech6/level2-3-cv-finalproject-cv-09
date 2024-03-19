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
        <div className="home">
          <MainNav/>
          <Grid container direction="row" justifyContent="center" alignItems="center">
          <div className='main_margin'></div>
            <Grid item  xs={4} lg={4}>
                  <div className="column_box">
                    <Box className="text1">Create Logo</Box>
                    <Box className="text2">로고를 생성해볼까요?</Box>
                    <PromptStart/>
                    </div>
                    </Grid>
                  <div className="between_margin"></div>
                  <Grid item >
                  <Slideshow className='slideshow'/>
                  </Grid>
              <div className='main_margin'></div>
          </Grid>
          <Footer/>
        </div>
    );
}
export default Home;