import { useLocation } from "react-router";
import MainNav from "../components/MainNav";
import { useNavigate } from 'react-router';
import React, { useState } from 'react';
import './ModeSelect.css';
import axios from "axios";

const ModeSelect = () =>{
    let location = useLocation();
    const name = location.state?.name;
    const [content, setContent] = useState('');
    //입력창에 글자를 입력했을때 변화를 적용하는 함수
    const onChange = (e) =>{setContent(e.target.value)}
    //글자를 입력후 엔터키를 눌렀을때 다음 페이지로 넘어가는 함수
    const onEnter =(e)=>{
      if((e.key == 'Enter') && (content)){
        onClickpost();  
        }
    }   
    const [MyImage, setMyImage] = useState();
  const onClickpost = () =>{
    axios.post('http://192.168.50.160:8000/prompt', 
    {
      name: name,
      prompt: content,
    })
    .then((response)=>{
      console.log('요청성공')
      setMyImage(`data:image/png;base64,${response.data.image}`)
  })
    .catch((error)=>{
      console.log('요청실패')
      console.log(error)  
  })
  }
    return(
        <div>
            <MainNav/>
            <div className='container' style={{paddingTop: "100px", paddingBottom: "200px"}}>
                <div className="QuestionT1">{name}(이)라는 로고를 만들게요.</div>
                <div className="QuestionT2">원하시는 프롬프트를 입력해주세요</div>
                <div >
                    <input className='inputline'
                        type="text"
                        title=''
                        onChange={onChange} //글자 입력 처리
                        onKeyUp={onEnter} //엔터키 입력 처리
                        required/>
                        <img
                style={{ maxWidth: "100%", height: "auto" }}
                src={MyImage}
                />
                </div>
            </div>
        </div>
);
}
export default ModeSelect;