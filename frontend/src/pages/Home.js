import React from "react"
import PromptStart from "../components/PromptStart";
import MainNav from "../components/MainNav";
import '../App.css';
import './Home.css';

const Home = () =>{
    return(
        <div>
          <MainNav/>
          <div>
            <section className='container box'>
              <div>
                <div className="text1">Create Logo</div>
                <div className="text2">로고를 생성해볼까요?</div>
              <PromptStart/>
              </div>
            </section>
          </div>
          </div>
    );
}
export default Home;