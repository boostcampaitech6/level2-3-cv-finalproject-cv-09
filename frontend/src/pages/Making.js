import MakingNav from "../components/MakingNav";
import Question01 from "../components/Question01";
import Question02 from "../components/Question02";
import Question03 from "../components/Question03";
import Question04 from "../components/Question04";

import './Making.css';
import React, { Component, useState, useRef } from 'react';
import { useLocation } from "react-router";
import axios from "axios";


const Making = () =>{
  let location = useLocation();
  const name = location.state?.name;

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
  const [MyImage, setMyImage] = useState();
  const onClickpost = () =>{
    axios.post('http://192.168.50.160:8000/prompt', 
    {
      name: name,
      prompt: checkItems.join(', '),
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
        <div>
          <MakingNav handleScrollView={handleScrollView} prompt={checkItems}/>
          <div>
            <section className='container'>
              <div ref={(el) => (scrollRef.current[0] = el)}>
              <Question01 handleScrollView={handleScrollView} handleSingleCheck={handleSingleCheck}/>
              </div>
              <div ref={(el) => (scrollRef.current[1] = el)}>
              <Question02 handleScrollView={handleScrollView} handleSingleCheck={handleSingleCheck}/>
              </div>
              <div ref={(el) => (scrollRef.current[2] = el)}>
              <Question03 handleScrollView={handleScrollView} handleSingleCheck={handleSingleCheck}/>
              </div>
              <div ref={(el) => (scrollRef.current[3] = el)}>
              <Question04 handleScrollView={handleScrollView} handleSingleCheck={handleSingleCheck}/>
              </div>
              <button className="button" onClick={onClickpost}>제작</button>
              <img
                style={{ maxWidth: "100%", height: "auto" }}
                src={MyImage}
                />
            </section>
          </div>
          </div>
    );
}

export default Making;