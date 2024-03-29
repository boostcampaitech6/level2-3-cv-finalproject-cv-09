import React from "react"
import MainNav from "../components/MainNav";
import './About.css';
import Footer from "../components/Footer";

const About = () =>{
    return(
        <div className="main">
          <MainNav/>
          <div>
            <section className='container box'>
              <div className="about_main">K-Logo Gen</div>
              <div className="about_text">안녕하세요! 저희는 Naver Boostcamp AI Tech CV 9조 SCV입니다!</div>
              <div className="about_text">사용자가 원하는 Prompt 입력을 통해서 로고를 제작해주는 프로그램입니다.</div>
              <div className="about_text">사업분야나 색 표현, 피사체 등을 Prompt에 입력하여 4가지 모델을 통해 생성된 로고를 체험할 수 있습니다.</div>
              <div className="about_text">지금 저희 사이트를 통해 원하는 로고를 만들어 보세요!</div>
              <div className="about_text">문의 메일 : mm074111@gmail.com</div>
              <div className="about_img">
                <img src="scv.png" alt="대체용 텍스트" width="50%"></img>
              </div>
            </section>
          </div>
          <Footer/>
        </div>
    );
}
export default About;