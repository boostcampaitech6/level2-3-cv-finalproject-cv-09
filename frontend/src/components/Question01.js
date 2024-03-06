//import { Link } from "react-router-dom";
import '../App.css';
import React, { useState } from 'react';

const Question01 = ({props, handleScrollView, handleSingleCheck}) => {

  const [Index, setIndex] = useState([
    {id: 0, title: '제조업',},
    {id: 1, title: 'IT사업',},
    {id: 2, title: '농업', },
    {id: 3, title: '어업',},
    {id: 4, title: '건설업', },
    {id: 5, title: '부동산', },
    {id: 6, title: '의료/바이오', },
    {id: 7, title: '교육', },
    {id: 8, title: '문화/예술', },
    {id: 9, title: '여행', },
    {id: 10, title: '우주/항공', },
    {id: 11, title: '로봇/인공지능', },
    // {id: 12, title: '화학', },
    // {id: 13, title: '미디어', },
    // {id: 14, title: '스포츠', },
    // {id: 15, title: '기타', },

  ]);
      return(
            <div style={{paddingTop: "30px", paddingBottom: "30px"}}>
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
                  <div className='select_button select_text'>{Index.title}</div></button>
                </li>
          </ul>
        ))}
              </div>
              <button className="nextbutton" id="Question02" onClick={handleScrollView}>다음으로</button>
              </div>
        );
    }
        
export default Question01;

