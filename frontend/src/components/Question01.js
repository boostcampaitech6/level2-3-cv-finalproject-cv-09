//import { Link } from "react-router-dom";
import '../App.css';
import React, { useState } from 'react';

const Question01 = ({props, handleScrollView, handleSingleCheck}) => {

  const [Index, setIndex] = useState([
    {id: 0, title: '비즈니스',},
    {id: 1, title: '행사',},
    {id: 2, title: '대회', },
    {id: 3, title: '동아리',},
    {id: 4, title: '유튜브', },
    {id: 5, title: 'SNS', },
    {id: 6, title: '단체', },
  ]);
      return(
            <div style={{paddingTop: "100px", paddingBottom:"200px"}}>
              <div className='QuestionT2'>어떤 분야에서 사용할 로고인지 알려주세요!</div>
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
              <button className="nextbutton" id="Question02" onClick={handleScrollView}>다음으로</button>
              </div>
        );
    }
        
export default Question01;

