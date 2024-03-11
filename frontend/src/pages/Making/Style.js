//import { Link } from "react-router-dom";
import '../../App.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router";

const Style = ({clickedCheck, handleSingleCheck, checkItems, name}) => {

  useEffect( () => {
    Index?.map((Index, key) => (
      Index.clicked=clickedCheck(Index.prompt)
    ))
    forceUpdate();
  },[]);
  const [,updateState]=useState();
  const forceUpdate = useCallback(()=>updateState({}),[]);

  const [Index, setIndex] = useState([
    {id: 0, title: '모던', prompt: 'moden style' },
    {id: 1, title: '고딕', prompt: 'gothic style'},
    {id: 2, title: '심플', prompt: 'simple style'},
    {id: 3, title: '화려한', prompt: 'fancy style'}
  ]);

  const navigate = useNavigate();
  const onClickNext = () =>{
    navigate("/promptcheck?name=" + name + "?prompt="+ checkItems, {state: { name, checkItems }});
  }
  
      return(
            <div style={{paddingTop: "100px", paddingBottom:"200px"}}>
              <div className='QuestionT2'>스타일을 지정해주세요</div>
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
        
export default Style;

