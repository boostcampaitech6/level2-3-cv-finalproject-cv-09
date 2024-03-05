import React from "react"
import PromptStart from "../components/PromptStart";
import MainNav from "../components/MainNav";
import '../App.css';
import './Home.css';

const Home = () =>{
    return(
        <div>
          <MainNav/>
          <section className='container box'>
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
          </section>
      </div>
    );
}
export default Home;