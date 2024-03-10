import '../../App.css';
import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router";

const Purpose = ({props, handleSingleCheck, name}) => {
  const [Index, setIndex] = useState([
    {id: 0, title: '프로모션', prompt: 'promotion'},
    {id: 1, title: '행사', prompt: 'event'},
    {id: 2, title: '비영리', prompt: 'non-profit'},
    {id: 3, title: '대회', prompt: 'Competition'}
  ]);
  const navigate = useNavigate();
  const onClickNext = () =>{
    navigate("/making/color?name=" + name, {state: { name }});
  }
      return(
            <div style={{paddingTop: "100px", }}>
              <div className='QuestionT2'>목적을 알려주세요.</div>
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
        
export default Purpose;

