//import { Link } from "react-router-dom";
import '../App.css';
import React, { useState } from 'react';

const Question04 = ({props, handleScrollView, handleSingleCheck}) => {
  const [Index, setIndex] = useState([
    {id: 0, title: '일단'},
    {id: 1, title: '임시로'},
    {id: 2, title: '넣은'},
    {id: 3, title: '지문'}
  ]);
      return(
            <div style={{paddingTop: "100px", }}>
              <div className='QuestionT2'>임시지문</div>
              <div className="button_margin">
              {Index?.map((Index, key) => (
                  <ul key={key} className="button_list">
                <li className="li">
                  <button key={key} aria-pressed={Index.clicked} className="button" name={`select-${Index.id}`}
                onClick={(e) => {
                  handleSingleCheck(Index.title);
                  Index.clicked=!Index.clicked;
                }}
                // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                >
                  <div className='buttonT1 buttonText'>{Index.title}</div></button>
                </li>
          </ul>
        ))}
              </div>
              
              </div>
        );
    }
        
export default Question04;

