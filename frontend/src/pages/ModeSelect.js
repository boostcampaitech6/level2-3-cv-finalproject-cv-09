import { useLocation, useNavigate } from "react-router";
import MainNav from "../components/MainNav";
import React, { useState } from 'react';
import './ModeSelect.css';
import Footer from "../components/Footer";
import Grid from '@mui/material/Grid';

const ModeSelect = () =>{
    let location = useLocation();
    const name = location.state?.name;
    const navigate = useNavigate();
    const onClickMaking = () =>{
    navigate("/making/area?name=" + name, {state: { name }});
  }
  const onClickAdv = () =>{
    navigate("/adv?name=" + name, {state: { name }});
  }
return(
    <div className="home">
      <MainNav/>
      <Grid container className= 'ModeSelect_container' justifyContent="center" alignItems="center">
        <Grid item xs={6}>
          <Grid item direction="column" className="modeselect" justifyContent="flex-start">
            <Grid item >
              <div className="select_margin1"></div>
              <div className="nametext" >{name}</div>
              <div className="modeselect_text">라는 로고를 만들게요</div>
              <div className="modeselect_text margin_under">원하시는 생성 방식을 선택해주세요</div>
              <Grid container justifyContent="flex-start" alignItems="center">
                <Grid item>
                  <div onClick={onClickMaking} className="modebutton" style={{marginRight:"auto"}}>
                    <div className="buttonText">
                      <div className="buttonT1">Simple Mode</div>
                      <div className="buttonT2">객관식</div>
                    </div>
                  </div>
                </Grid>
                <Grid item className="margin_grid"></Grid>
                  <Grid item>
                    <div onClick={onClickAdv} className="modebutton" style={{marginLeft:"auto"}}>
                      <div className="buttonText">
                        <div className="buttonT1">Typing Mode</div>
                        <div className="buttonT2">주관식</div>
                      </div>
                    </div>
                  </Grid>
              </Grid>
            </Grid>
          <div className="select_margin2"></div>
          </Grid>
        </Grid>
      </Grid>
      <Footer></Footer>
    </div>
);
}
export default ModeSelect;