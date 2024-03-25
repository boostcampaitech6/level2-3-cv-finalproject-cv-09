import { useLocation } from "react-router";
import MainNav from "../components/MainNav";
import { useNavigate } from 'react-router';
import React, { useEffect, useState } from 'react';
import {useKoPrompt} from '../context'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import './Adv.css'
import './ModeSelect.css'
import Footer from "../components/Footer";
import axios from 'axios';

const PromptCheck = () =>{
  let location = useLocation();
  const name = location.state?.name;
  const checkItems = location.state?.checkItems;
  const {setKoPromptList,prompt_sentence} = useKoPrompt();
  const sentence = prompt_sentence()+`로고에 "${name}"라는 글자가 아래 작성되어 있다.`;
  const [prompt, setPrompt] = useState('');

  const navigate = useNavigate();

  const [ismodalopen, setIsmodalopen] = useState(false);
  const openModal = () => setIsmodalopen(true);
  const closeModal = () => setIsmodalopen(false);
  const [modaltext, setModaltext] = useState()
  
  const [user_id, setUserid] = useState('0.0.0.0')
  const ipget = () =>{
    axios.get('https://geolocation-db.com/json/')
    .then((res) => {
      setUserid(res.data.IPv4)
    })
  }

  const onClickResult = () =>{
  setModaltext('로고 생성 요청....')
  openModal()
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
    if(ckstate === 1) {
      navigate("/result?taskid=" + taskid , {state: { taskid }});
    }
  },[taskid]);

  const imggenAPIPost = () =>{
    console.log('image gen call')
    axios.post('/api/prompt', 
    {
      user_id: user_id,
      name: name,
      prompt: prompt,
    })
    .then((response)=>{
      console.log('image gen call success')
      setTaskID(response.data.task_id);
      setCkstate(ckstate+1)
    })
      .catch((error)=>{
        console.log('image gen call FAILURE')
        console.log(error)
        setModaltext('서버 연결에 오류가 발생했습니다!')
        openModal()
    })
  }
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
      <div className="main">
        <MainNav/>
        <div className="adv_main">
          <Modal
            open={ismodalopen}
            onClose={closeModal}>
            <Box sx={style}>
              <div>{modaltext}</div>
            </Box>
          </Modal>
          <Grid container className= 'Adv_Main_container' justifyContent="center" alignItems="center">
            <Grid item xs={6}>
              <div className="adv_name_txt" >{name}</div>
              <Grid item justifyContent="center" alignItems="center" style={{ margin: '0 0 5vh 0'}}>
                <Box className="PromptCheck" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', padding: '10px 10px 10px 20px'}} >{sentence}</Box>
                <div className="margin_under"></div>
              </Grid>
              <Grid container justifyContent="center" alignItems="center">
                <Grid item>
                  <div onClick={ () =>
                    {ipget()
                    onClickResult()
                  }} className="modebutton" style={{marginRight:"auto"}}>
                    <div className="choose_txt">
                      <div className="button_txt1">Making Logo</div>
                      <div className="button_txt2">로고를 생성할래요!</div>
                    </div>
                  </div>
                </Grid>
                <Grid item className="margin_grid"></Grid>
                <Grid item>
                  <div onClick={onClickAdv} className="modebutton" style={{marginLeft:"auto"}}>
                    <div className="choose_txt">
                      <div className="button_txt1">Typing Mode</div>
                      <div className="button_txt2">추가 수정하고 싶어요!</div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Footer/>
      </div>
  );
}
export default PromptCheck;