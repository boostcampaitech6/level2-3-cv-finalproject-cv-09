import { useLocation } from "react-router";
import MainNav from "../components/MainNav";
import Loding from "../components/Loding";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Result.css';

const Makedlogo = () =>{
  let location = useLocation();
  const name = location.state?.name;
  const prompt = location.state?.prompt;
  const [loding, setLoding] = useState(true);
  useEffect( () => {
    logoapipost();
  },[]);

  const logoapipost = () =>{
    console.log('요청시도')
    axios.post('/prompt', 
    {
      name: name,
      prompt: prompt,
    })
    .then((response)=>{
      console.log('요청성공')
      Index?.map((Index, key) => (
        Index.img = `data:image/png;base64,${response.data.images[key]}`
      ))
      setLoding(false)
  })
    .catch((error)=>{
      console.log('요청실패')
      console.log(error)  
  })
  }
  const [Index, setIndex] = useState([
    {id: 0, title: 'image01', img:''},
    {id: 1, title: 'image02', img:''},
    {id: 2, title: 'image03', img:''},
    {id: 3, title: 'image04', img:''},
  ]);
return(
    <div >
        <MainNav/>
        {loding ? ( //로딩이 참이면, 로딩 페이지로
        <Loding />) : (
        <div className='container box'>
            {Index?.map((Index, key) => (
                  <ul key={key} className="button_list">
                <li className="logoli">
                  <button key={key} aria-pressed={Index.clicked} className="logobutton" style={{marginLeft:"auto"}} name={`select-${Index.id}`}
                onClick={(e) => {
                  
                  Index.clicked=!Index.clicked;
                }}
                // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                >   <img src={Index.img}/>
                  <div className='buttonT1 buttonText'>{Index.title}</div>
                  </button>
                </li>
          </ul>
        ))}

        </div>
        )}
    </div>
    
)
}
export default Makedlogo;