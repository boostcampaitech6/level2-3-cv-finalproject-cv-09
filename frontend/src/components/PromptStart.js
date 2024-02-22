import React, { Component, useState } from 'react';
import { useNavigate } from 'react-router';
import './PromptStart.css';

const PromptStart = () => {
      const [content, setContent] = useState('');
      const navigate = useNavigate();
      const onChange = (e) =>{setContent(e.target.value)}
      const onClick = () =>{
            navigate("/making?name=" + content, {state: { content }});
      }
      const onEnter =(e)=>{
            if(e.key == 'Enter'){
                  onClick();  
            }
      }
      
      return(
            <div class='inputbox'>
                <input class='inputline'
                type="text"
                title=''
                onChange={onChange}
                onKeyUp={onEnter}
                required
                />
                <label class='label'>브랜드 이름을 입력해주세요!</label>
                <span class='span'></span>
                <button href=""
                  class='startbutton'
                  style={{ textDecoration: "none" }}
                  onClick={onClick}>
                  start</button>
            </div>
      );
    }

export default PromptStart;