import '../App.css';
import MainNav from "../components/MainNav";
import Footer from "../components/Footer";
import { Grid } from "@mui/material";
import HowToData from '../components/HowTo_data';
import "./HowTo.css";


const HowTo = () =>{
    return(
        <div>
          <div className='howto_column_box'>
          <MainNav/>
            <Grid style={{textAlign:"center", marginBottom:"5vh"}}>
              {HowToData.map((index, key) => (
                <div className="howto_card">
                  <h2 style={{ fontFamily: 'Spoqa Han Sans Neo', marginTop:"5vh", marginBottom:"5vh"}}>{key+1}. {index.text}</h2>
                  <img src={index.img} style={{height:"50vh",marginBottom:"5vh"}}/>
                </div>
              ))}
            </Grid>
            <Footer/>
            </div>
          </div>
    );
}
export default HowTo;