import React from "react"
import PromptStart from "../components/PromptStart";
import MainNav from "../components/MainNav";
import '../App.css';

const Home = () =>{
    return(
        <div>
          <MainNav/>
          <mian>
            <section class='container box'>
              <PromptStart></PromptStart>
            </section>
          </mian>
          </div>
    );
}
export default Home;