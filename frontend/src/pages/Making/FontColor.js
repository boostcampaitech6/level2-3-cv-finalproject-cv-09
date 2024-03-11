//import { Link } from "react-router-dom";
import '../../App.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router";

const FontColor = ({clickedCheck, handleSingleCheck, name}) => {

  useEffect( () => {
    Index?.map((Index, key) => (
      Index.clicked=clickedCheck(Index.prompt)
    ))
    forceUpdate();
  },[]);
  const [,updateState]=useState();
  const forceUpdate = useCallback(()=>updateState({}),[]);

  const [Index, setFIndex] = useState([
    {id: 0, title: '빨강', prompt: 'red color text'},
    {id: 1, title: '주황', prompt: 'orange color text'},
    {id: 2, title: '노랑', prompt: 'yellow color text'},
    {id: 3, title: '초록', prompt: 'green color text'},
    {id: 4, title: '파랑', prompt: 'blue color text'},
    {id: 5, title: '남색', prompt: 'navy color text'},
    {id: 6, title: '보라', prompt: 'purple color text'}
  ]);
  const navigate = useNavigate();
  const onClickNext = () =>{
    navigate("/making/backgroundcolor?name=" + name, {state: { name }});
  }
      return(
            <div style={{paddingTop: "100px", paddingBottom:"200px"}}>
              <div className='QuestionT2'>폰트 색상을 지정해주세요</div>
              <div className="button_margin">
              {Index?.map((Index, key) => (
                  <ul key={key} className="button_list">
                <li className="li">
                  <button key={key} aria-pressed={Index.clicked} className="button" name={`select-${Index.id}`}
                onClick={(e) => {
                  handleSingleCheck(Index.prompt);
                  Index.clicked=!Index.clicked;
                }}
                // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                >
                  <div className='select_button select_text'>{Index.title}</div></button>
                </li>
          </ul>
        ))}
              </div>
              <button className="nextbutton" onClick={onClickNext}>다음으로</button>
              </div>
        );
    }
        
export default FontColor;

