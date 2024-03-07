import { useLocation } from "react-router";
import MainNav from "../components/MainNav";
import { useNavigate } from 'react-router';
import React, { useEffect, useState } from 'react';
import './ModeSelect.css';
import axios from "axios";

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {Button, Stack} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';


const ModeSelect = () =>{
    let location = useLocation();
    const name = location.state?.name;
    const prompt = location.state?.prompt;
    const [content, setContent] = useState('');
    //입력창에 글자를 입력했을때 변화를 적용하는 함수
    const onChange = (e) =>{setContent(e.target.value)}
    //글자를 입력후 엔터키를 눌렀을때 다음 페이지로 넘어가는 함수
    const onEnter =(e)=>{
      if((e.key == 'Enter') && (content)){
        onClickResult();  
        }
    }
    const navigate = useNavigate();
    const onClickResult = () =>{
      navigate("/result?name=" + name + "?prompt="+ prompt, {state: { name, prompt }});
    }
    useEffect( () =>{
      if (prompt){setContent(prompt.join(", "))}
      else{setContent('프롬프트를 입력해주세요')}
    })
    
    return(
        <div>
            <MainNav/>
            <div className='container' style={{paddingTop: "100px", paddingBottom: "200px"}}>
              <div className="nametext" >{name}</div> 
              <br></br>
              <div className="QuestionT2">라는 로고를 만들게요.</div>
              <div className="QuestionT2">원하시는 프롬프트를 입력해주세요.</div>
              <div >
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '60ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Box sx={{ position: 'relative',
                            // width: '100%'
                             }}>
                    <TextField
                      id="outlined-multiline-static"
                      label="프롬프트"
                      multiline
                      onChange={onChange} 
                      onKeyUp={onEnter} 
                      rows={10}
                      defaultValue={content}
                      // fullWidth
                    />
                  </Box>
                  <Box sx={{ position: 'relative', bottom: -50, left: 410 }}>
                    <Stack direction="row" spacing={2}>
                      <Button 
                        href="" 
                        variant="contained" 
                        endIcon={<SendIcon />}
                        onClick={onClickResult} //버튼 클릭 처리
                        disabled={!name}//버튼 활성화 처리
                        >
                        로고 생성하기
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              </div>
            </div>
        </div>
);
}
export default ModeSelect;