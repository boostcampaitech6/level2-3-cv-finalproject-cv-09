import MakingNav from "../components/MakingNav";
import Question01 from "../components/Question01";
import Question02 from "../components/Question02";
import Question03 from "../components/Question03";
import Question04 from "../components/Question04";

import './Making.css';
import React, { Component, useState, useRef } from 'react';
import { useLocation, useNavigate } from "react-router";
import axios from "axios";


const Making = () =>{
  let location = useLocation();
  const name = location.state?.name;
  const navigate = useNavigate();
    const onClickPromptCheck = () =>{
    navigate("/promptcheck?name=" + name + "?prompt="+ checkItems, {state: { name, checkItems }});
  }
  const [checkItems, setCheckItems] = useState([]);
  const handleSingleCheck = (title) => {
    if (checkItems.includes(title)) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckItems(checkItems.filter((el) => el !== title));
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckItems(prev => [...prev, title]);
    }
  };
  const scrollRef = useRef([]);
  const handleScrollView = (event) => {
    const name = event.target.id;
    const category = {
      Question01: 0,
      Question02: 1,
      Question03: 2,
      Question04: 3,
    };
    scrollRef.current[category[name]].scrollIntoView({
      behavior: "smooth",
    });
  };
    return(
      <div className="making_column_box">
        <div className="making_column1">
          <MakingNav handleScrollView={handleScrollView} prompt={checkItems.join(', ')}/>
        </div>
        <div className="making_column2">
          <section className='container'>
            <div ref={(el) => (scrollRef.current[0] = el)}>
            <Question01 handleScrollView={handleScrollView} handleSingleCheck={handleSingleCheck}/>
            </div>
            {/* <div ref={(el) => (scrollRef.current[1] = el)}>
            <Question02 handleScrollView={handleScrollView} handleSingleCheck={handleSingleCheck}/>
            </div>
            <div ref={(el) => (scrollRef.current[2] = el)}>
            <Question03 handleScrollView={handleScrollView} handleSingleCheck={handleSingleCheck}/>
            </div>
            <div ref={(el) => (scrollRef.current[3] = el)}>
            <Question04 handleScrollView={handleScrollView} handleSingleCheck={handleSingleCheck}/>
            </div> */}
            {/* <button className="button" onClick={onClickpost}>제작</button> */}
            <button className="button" onClick={onClickPromptCheck}>제작</button>
          </section>
        </div>
        </div>
    );
}

export default Making;