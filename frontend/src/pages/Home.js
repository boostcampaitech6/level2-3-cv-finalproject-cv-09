import React from "react"
import PromptStart from "../components/PromptStart";
import MainNav from "../components/MainNav";
import Footer from "../components/Footer";
import '../App.css';
import './Home.css';

const Home = () =>{
    
    return(
        <div className="home">
          <MainNav/>
          <div className="home_align">
            <div className='home_main'>
              <div className='main_margin'></div>
                <div className="column_box">
                  <div className="column1">
                    <div className="text1">Create Logo</div>
                    <div className="text2">로고를 생성해볼까요?</div>
                    <PromptStart/>
                  </div>
                  <div className="column2">
                  <img alt="HTML" src="https://www.w3schools.com/whatis/img_js.png"></img>
                  </div>
                </div>
              <div className='main_margin'></div>
            </div>
          </div>
          <Footer/>
        </div>
    );
}
export default Home;