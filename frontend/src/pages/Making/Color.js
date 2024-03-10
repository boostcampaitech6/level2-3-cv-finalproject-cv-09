//import { Link } from "react-router-dom";
import '../../App.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router";

const Color = ({handleSingleCheck, name}) => {
  const [FIndex, setFIndex] = useState([
    {id: 0, title: '빨강', prompt: 'red'},
    {id: 1, title: '주황', prompt: 'orange'},
    {id: 2, title: '노랑', prompt: 'yellow'},
    {id: 3, title: '파랑', prompt: 'blue'}
  ]);
  const [BIndex, setBIndex] = useState([
    {id: 0, title: '빨강', prompt: 'red'},
    {id: 1, title: '주황', prompt: 'orange'},
    {id: 2, title: '노랑', prompt: 'yellow'},
    {id: 3, title: '파랑', prompt: 'blue'}
  ]);
  const navigate = useNavigate();
  const onClickNext = () =>{
    navigate("/making/style?name=" + name, {state: { name }});
  }
      return(
            <div style={{paddingTop: "100px", paddingBottom:"200px"}}>
              <div className='QuestionT2'>폰트 색상을 지정해주세요</div>
              <div className="button_margin">
              {FIndex?.map((Index, key) => (
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
        <div className='QuestionT2'>배경 색상을 지정해주세요</div>
              <div className="button_margin">
              {BIndex?.map((Index, key) => (
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
              </div>
              <button className="nextbutton" onClick={onClickNext}>다음으로</button>
              </div>
        );
    }
        
export default Color;

