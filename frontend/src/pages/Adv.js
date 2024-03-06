import { useLocation } from "react-router";
import MainNav from "../components/MainNav";
import { useNavigate } from 'react-router';
import React, { useEffect, useState } from 'react';
import './ModeSelect.css';
import axios from "axios";

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
    })
    return(
        <div>
            <MainNav/>
            <div className='container' style={{paddingTop: "100px", paddingBottom: "200px"}}>
              <div className="nametext" >{name}</div>
              <div className="QuestionT2">라는 로고를 만들게요.</div>
              <div className="QuestionT2">원하시는 프롬프트를 입력해주세요.</div>
              <div >
                <input 
                  defaultValue={content}
                  className='inputline'
                  type="text"
                  title=''
                  onChange={onChange} //글자 입력 처리
                  onKeyUp={onEnter} //엔터키 입력 처리
                  required
                  autoFocus/>
                  <button href=""
                        onClick={onClickResult} //버튼 클릭 처리
                        disabled={!name}//버튼 활성화 처리
                        >start</button>
                </div>
            </div>
        </div>
);
}
export default ModeSelect;