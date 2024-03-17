import SideNavbar from "../../components/SideNavbar";
import AreaData from '../../components/SelectCard_data/Area_SelectCard_data';
import BgColorData from '../../components/SelectCard_data/BgColor_SelectCard_data';
import PurposeData from '../../components/SelectCard_data/Purpose_SelectCard_data';
import FontColorData from '../../components/SelectCard_data/FontColor_SelectCard_data';
import StyleData from '../../components/SelectCard_data/Style_SelectCard_data';
import Area from './Area';
import BackgroundColor from './BackgroundColor';
import Purpose from './Purpose';
import FontColor from './FontColor';
import Style from './Style';

import './Making.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useLocation } from "react-router";

const Making = () =>{
  let location = useLocation();
  const name = location.state?.name;
  const QuestionAbout = { 'Area':'어떤 분야에서 사용할 로고인지 알려주세요.', 
                          'FontColor':'폰트 색상을 지정해주세요.', 
                          'BackgroundColor':'배경 색상을 지정해주세요', 
                          'Purpose':'목적을 알려주세요.',
                          'Style':'스타일을 지정해주세요'}
    return(
      <div className="making_column_box">
        <div className="making_column1">
          <SideNavbar name={name}/>
        </div>
        <div className="making_column2">
          <section className='container'>
            <Routes>
              <Route path='area' element ={<Area nextNavigate='purpose' 
                                                       name={name} 
                                                       QuestionAbout={QuestionAbout['Area']} 
                                                       itemData={AreaData} />}></Route>
              <Route path='purpose' element ={<Purpose nextNavigate='fontcolor' 
                                                          name={name} 
                                                          QuestionAbout={QuestionAbout['Purpose']} 
                                                          itemData={PurposeData} />}></Route>
              <Route path='fontcolor' element ={<FontColor nextNavigate='backgroundcolor' 
                                                            name={name} 
                                                            QuestionAbout={QuestionAbout['FontColor']} 
                                                            itemData={FontColorData} />}></Route>
              <Route path='backgroundcolor' element ={<BackgroundColor nextNavigate='style' 
                                                                  name={name} 
                                                                  QuestionAbout={QuestionAbout['BackgroundColor']} 
                                                                  itemData={BgColorData} />}></Route>
              <Route path='style' element ={<Style nextNavigate='PromptCheck'
                                                        name={name} 
                                                        QuestionAbout={QuestionAbout['Style']} 
                                                        itemData={StyleData} />}></Route>
            </Routes>
          </section>
        </div>
      </div>
    );
}

export default Making;