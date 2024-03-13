import MakingNav from "../../components/MakingNav";
import Area from "./Area";
import Purpose from "./Purpose";
import FontColor from "./FontColor";
import BackgroundColor from "./BackgroundColor";
import Style from "./Style";


import './Making.css';
import React, { useState, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useLocation, useNavigate } from "react-router";

const Making = () =>{
  let location = useLocation();
  const name = location.state?.name;
  const [checkItems, setCheckItems] = useState([]);
  const handleSingleCheck = (prompt) => {
    if (checkItems.includes(prompt)) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckItems(checkItems.filter((el) => el !== prompt));
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckItems(prev => [...prev, prompt]);
    }
  };
  const clickedCheck = (prompt) => {
    if (checkItems.includes(prompt)) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      return true;
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      return false;
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
          <MakingNav handleScrollView={handleScrollView} name={name} prompt={checkItems.join(', ')}/>
        </div>
        <div className="making_column2">
          <section className='container'>
            <Routes>
              <Route path='area' element ={<Area clickedCheck={clickedCheck} handleSingleCheck={handleSingleCheck} name={name} />}></Route>
              <Route path='purpose' element ={<Purpose clickedCheck={clickedCheck} handleSingleCheck={handleSingleCheck} name={name} />}></Route>
              <Route path='fontcolor' element ={<FontColor clickedCheck={clickedCheck} handleSingleCheck={handleSingleCheck} name={name} />}></Route>
              <Route path='backgroundcolor' element ={<BackgroundColor clickedCheck={clickedCheck} handleSingleCheck={handleSingleCheck} name={name} />}></Route>
              <Route path='style' element ={<Style clickedCheck={clickedCheck} handleSingleCheck={handleSingleCheck} name={name} checkItems={checkItems}/>}></Route>
            </Routes>
          </section>
        </div>
        </div>
    );
}

export default Making;