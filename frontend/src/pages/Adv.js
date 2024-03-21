import { useLocation } from "react-router";
import MainNav from "../components/MainNav";
import { useNavigate } from 'react-router';
import React, { useState, useEffect } from 'react';
import './Adv.css';

import {Button, Stack, Paper, Box, TextField, Grid, useMediaQuery, Modal } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Footer from "../components/Footer";
import axios from 'axios';

const AdvancedMode = () =>{
    let location = useLocation();
    const name = location.state?.name;
    const content = location.state?.sentence;
    const [sentence, setPrompt] = useState(location.state?.sentence);
    
    //입력창에 글자를 입력했을때 변화를 적용하는 함수
    const onChange = (e) =>{
      setPrompt(e.target.value)
      setModaltext(sentence+"라는 로고를 생성하시겠습니까?")
    }

  const [ismodalopen, setIsmodalopen] = useState(false);
  const openModal = () => setIsmodalopen(true);
  const closeModal = () => {
    setIsmodalopen(false)
    setModaltext(sentence+"라는 로고를 생성하시겠습니까?")
    setButtondisplay("")
  };
  const [modaltext, setModaltext] = useState(sentence+"라는 로고를 생성하시겠습니까?")
  const [buttondisplay, setButtondisplay] = useState("")

    //글자를 입력후 엔터키를 눌렀을때 다음 페이지로 넘어가는 함수
    //const onEnter =(e)=>{
      //if((e.key == 'Enter') && (prompt)){
        //onClickResult();  
        //}
    //}
    const navigate = useNavigate();
    const onClickResult = () =>{
      imggenAPIPost();
    }
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
      user_id: '123',
      name: name,
      prompt: sentence,
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
      setButtondisplay('none')
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
    // 화면 크기에 따라 다른 ui구성
    const isMobile = useMediaQuery('(max-width:600px)');
    return(
      <div className="adv">
        
          <MainNav></MainNav>
          <div className="adv_main">
          <Modal
      open={ismodalopen}
      onClose={closeModal}
      ><Box sx={style}>
        <div>{modaltext}</div>
        <Button 
          href="" 
          variant="contained"
          style={{display:buttondisplay}}
          endIcon={<SendIcon />}
          onClick={onClickResult} //버튼 클릭 처리
          disabled={!name}//버튼 활성화 처리
        >
            로고 생성
        </Button>
        
      </Box>
      </Modal>
          <Grid container>
            <Grid container className= 'Adv_Main_container' justifyContent="center" alignItems="center">
              <Grid item xs={6}>
                <div className="nametext">{name}</div> 
                <div className="adv_text">브랜드에 대한 구체적인 설명을 바탕으로 로고를 생성합니다.<br/> 로고의 특징을 입력해주세요.</div>
                
                {isMobile &&(
                <Grid item>
                  <Box sx={{ padding: 2 }}>
                    <Paper className="PromptExample_mobile" elevation={3} sx={{ padding: 2 }}>
                      예시<br/><br/>
                      고기 음식점의 로고이다. 흰색 배경에 검정색 글자로 '맛있는 고기집'이라고 적힌 로고.<br/><br/>
                      </Paper>
                  </Box>
                </Grid>)} 
                {!isMobile &&(
                <Grid item>
                  <Box sx={{ padding: 2 }}>
                    <Paper className="PromptExample" elevation={3} sx={{ padding: 2 }}>
                      예시<br/><br/>
                      1. 고기 음식점의 로고이다. 흰색 배경에 검정색 글자로 '맛있는 고기집'이라고 적힌 로고.<br/><br/>
                      2. 흰색 바탕에 빨간색 떡볶이 캐릭터가 그려진 떡볶이 전문 음식점의 로고. "매운떡볶이"라는 검정색과 빨간색 글자가 적혀있다.
                      </Paper>
                  </Box>
                </Grid>)}
                <Grid item>
                  <Box
                    component="form"
                    sx={{'& .MuiTextField-root':{mb: 2,mt: 2, width: '100%', minWidth: '100px' }}}
                    noValidate
                    autoComplete="off"
                  >
                    <Box sx={{ position: 'relative',
                              width: '100%'
                              }}>
                      <TextField
                        id="outlined-multiline-static"
                        label="로고의 특징을 입력해주세요."
                        multiline
                        onChange={onChange} 
                        rows={10}
                        placeholder="로고에 글자를 넣고 싶을 때는 따옴표로(예시:'글자') 표시해주세요."
                        defaultValue={content}
                      />
                    </Box>
                  </Box>
                </Grid>
              
                <Grid container justifyContent="flex-end">
                  <Box>
                    <Stack direction="row" spacing={2}>
                      <Button 
                        href="" 
                        variant="contained" 
                        endIcon={<SendIcon />}
                        onClick={openModal} //버튼 클릭 처리
                        disabled={!name}//버튼 활성화 처리
                        >
                        로고 생성
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Footer></Footer>
      </div>
);
}
export default AdvancedMode;
