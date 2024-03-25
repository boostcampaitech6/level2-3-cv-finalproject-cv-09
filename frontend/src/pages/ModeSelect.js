import { useLocation, useNavigate } from "react-router";
import MainNav from "../components/MainNav";
import React from 'react';
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
      <div className="main">
        <MainNav/>
        <Grid item direction="row" justifyContent="space-around" alignItems="baseline">
          <Grid item xs={10}>
            <div className='modeselect_column'>
              <div className="nametext" >{name}</div>
              <div className="modeselect_text">라는 로고를 만들게요</div>
              <div className="modeselect_text margin_under">원하시는 생성 방식을 선택해주세요</div>
            </div>
            <Grid container justifyContent="center" alignItems="center">
              <Grid item>
                <div onClick={onClickMaking} className="modebutton" style={{marginRight:"auto"}}>
                  <div className="choose_txt">
                    <div className="button_txt1">Simple Mode</div>
                    <div className="button_txt2">객관식</div>
                  </div>
                </div>
              </Grid>
              <Grid item className="margin_grid"></Grid>
                <Grid item>
                  <div onClick={onClickAdv} className="modebutton" style={{marginLeft:"auto"}}>
                    <div className="choose_txt">
                      <div className="button_txt1">Typing Mode</div>
                      <div className="button_txt2">주관식</div>
                    </div>
                  </div>
                </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Footer/>
      </div>
      );
}
export default ModeSelect;