import React, { Component, useState } from 'react';
import { useNavigate } from 'react-router';
import './PromptStart.css';

const PromptStart = () => {
      const [name, setname] = useState('');
      const navigate = useNavigate();
      //입력창에 글자를 입력했을때 변화를 적용하는 함수
      const onChange = (e) =>{
            e.target.value = e.target.value.replace(/[^A-Za-z1-9 ]/ig, '')
            setname(e.target.value)}
      //시작 버튼을 클릭했을 때 다음 페이지로 넘어가는 함수
      const onClick = () =>{
            navigate("/ModeSelect?name=" + name, {state: { name }});
      }
      //글자를 입력후 엔터키를 눌렀을때 다음 페이지로 넘어가는 함수
      const onEnter =(e)=>{
            if((e.key == 'Enter') && (name)){
                  onClick();  
            }
      }
      return(
            <div className="inputbbox">
                  <div className='inputbox'>
                        <input className='inputline'
                        type="text"
                        title=''
                        onChange={onChange} //글자 입력 처리
                        onKeyUp={onEnter} //엔터키 입력 처리
                        required
                        />
                        <label className='label'>브랜드 이름을 입력해주세요!</label>
                        <span className='span'></span>
                  </div>
                  <button href=""
                        className='startbutton'
                        style={{ textDecoration: "none" }}
                        onClick={onClick} //버튼 클릭 처리
                        disabled={!name}//버튼 활성화 처리
                        >start</button>
            </div>
      );
}

export default PromptStart;