import { useLocation } from "react-router";
import MainNav from "../components/MainNav";
import { useNavigate } from 'react-router';
import React, { useEffect, useState } from 'react';
import {useKoPrompt} from '../context'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import './ModeSelect.css'
import Footer from "../components/Footer";
import axios from 'axios';

const PromptCheck = () =>{
  let location = useLocation();
  const name = location.state?.name;
  const checkItems = location.state?.checkItems;
  const {setKoPromptList,prompt_sentence} = useKoPrompt();
  const sentence = prompt_sentence()+`그리고 "${name}"라는 글자가 아래 작성되어 있다.`;
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();
  
  const onClickResult = () =>{
  imggenAPIPost();
  }
  const onClickAdv = () =>{
    navigate("/adv?name=" + name + "?prompt="+ prompt, {state: { name, sentence }});
  }
  useEffect( () =>{
    setPrompt(checkItems.join(", "))
    setKoPromptList(checkItems)
  },[])
  const [ckstate, setCkstate] = useState(0)
  const [taskid, setTaskID] = useState()
  useEffect( () => {
    setCkstate(ckstate+1)
    if(ckstate === 1) {
      navigate("/result?taskid=" + taskid , {state: { taskid }});
    }
  },[taskid]);

  const imggenAPIPost = () =>{
    console.log('image gen call')
    axios.post('/api/prompt', 
    {
      user_id: '123',
      name: name,
      prompt: prompt,
    })
    .then((response)=>{
      console.log('image gen call success')
      setTaskID(response.data.task_id);
  })
    .catch((error)=>{
      console.log('image gen call FAILURE')
      console.log(error)  
  })
  }
return(
  <div className="modeselect">
    <MainNav/>
    <div className="modeselect_main">
      <Grid container className= 'ModeSelect_container' justifyContent="center" alignItems="center">
        <Grid item xs={6}>
          <div className="nametext" >{name}</div>
          <Grid item justifyContent="center" alignItems="center">
          <Box className="PromptCheck" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', padding: '10px 10px 10px 20px'}} >{sentence}</Box>
          <div className="margin_under"></div>
          </Grid>
          <Grid container justifyContent="space-evenly" alignItems="center">
              <Grid item>
                <div onClick={onClickResult} className="modebutton" style={{marginRight:"auto"}}>
                  <div className="buttonText">
                    <div className="buttonT1">making logo</div>
                    <div className="buttonT2">로고를 생성할래요!</div>
                  </div>
                </div>
              </Grid>
              {/* <Grid item className="margin_grid"></Grid> */}
              <Grid item>
                <div onClick={onClickAdv} className="modebutton" style={{marginLeft:"auto"}}>
                  <div className="buttonText">
                    <div className="buttonT1">typing mode</div>
                    <div className="buttonT2">추가 수정하고 싶어요!</div>
                  </div>
                </div>
              </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
    <Footer></Footer>
  </div>
);
}
export default PromptCheck;