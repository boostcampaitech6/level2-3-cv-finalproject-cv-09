import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import HowTo from './pages/HowTo';
import Devs from './pages/Devs';
import Making from './pages/Making';
import Adv from './pages/Adv';
import ModeSelect from './pages/ModeSelect';
import PromptCheck from './pages/PromptCheck';
import Result from './pages/Result';
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';


const App = ()=> {
  return (
    <div className="app">
      <BrowserRouter>
          <Routes>
            <Route path='/' element ={<Home/>}/>
            <Route path='/about' element ={<About/>}/>
            <Route path='/howto' element ={<HowTo/>}/>
            <Route path='/devs' element ={<Devs/>}/>
            <Route path='/modeSelect' element ={<ModeSelect/>}/>
            <Route path='/making' element ={<Making/>}/>
            <Route path='/adv' element ={<Adv/>}/>
            <Route path='/promptcheck' element ={<PromptCheck/>}/>
            <Route path='/result' element ={<Result/>}/>
          </Routes>
          </BrowserRouter>
    </div>
    );
}

export default App;
