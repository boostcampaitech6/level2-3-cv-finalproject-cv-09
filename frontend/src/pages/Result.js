import { useLocation } from "react-router";
import MainNav from "../components/MainNav";
import Loding from "../components/Loding";
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import './Result.css';

const Makedlogo = () =>{
  let location = useLocation();
  const name = location.state?.name;
  const prompt = location.state?.prompt;
  //const [loding, setLoding] = useState(true);
  //const saveTaskID = JSON.parse(localStorage.getItem('taskid')) || [];
  const [taskid, setTaskID] = useState();
  const [,updateState]=useState();
  const forceUpdate = useCallback(()=>updateState({}),[]);
  useEffect( () => {
    imggenAPIPost();
    setTimeout( () => {
    }, 1000);
  },[]);

  const imggenAPIPost = () =>{
    console.log('image gen call')
    axios.post('/api/prompt', 
    {
      user_id: '123',
      name: name,
      prompt: prompt,
    })
    .then((response)=>{
      console.log('image gen call success')
      setTaskID(response.data.task_id);
      //setLoding(false)
  })
    .catch((error)=>{
      console.log('요청실패')
      console.log(error)  
  })
  }
  const downloadImage = (imageUrl) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = 'image.png'; // 다운로드될 파일명
    downloadLink.target = "_blank"
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  const get_image = () => {
    console.log('get image call')
    axios.get('/api/get_image/' + taskid)
    .then((response)=>{
      console.log('get image call success')
      console.log(response.data.status)
      if (response.data.status === "SUCCESS"){
      Index?.map((Index, key) => (
        Index.imgurl = response.data.result[key]
      ))
    }
    forceUpdate();
      //setLoding(false)
  })
    .catch((error)=>{
      console.log('요청실패')
      console.log(error)  
  })
  }
  const [Index, setIndex] = useState([
    {id: 0, title: 'image01', imgurl:''},
    {id: 1, title: 'image02', imgurl:''},
    {id: 2, title: 'image03', imgurl:''},
    {id: 3, title: 'image04', imgurl:''},
  ]);
return(
    <div >
        <MainNav/>
        <div className='container box'>
          <div>{taskid}</div>
          <button onClick={get_image}>새로고침</button>
          <div>{Index.imgurl}</div>
            {Index?.map((Index, key) => (
                  <ul key={key} className="button_list">
                <li className="logoli">
                  <button key={key} aria-pressed={Index.clicked} className="logobutton" style={{marginLeft:"auto"}} name={`select-${Index.id}`}
                // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                >
                  
                <img src={Index.imgurl} referrerPolicy="no-referrer"/>
                  <div className='buttonT1 buttonText'>{Index.title}</div>
                  </button>
                  <button key={key} onClick={(e) => {
                  downloadImage(Index.imgurl);
                }}>다운로드</button>
                <a></a>
                </li>
          </ul>
        ))}
        </div>
    </div>
    
)
}
export default Makedlogo;