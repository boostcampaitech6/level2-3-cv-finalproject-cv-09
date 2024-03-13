import React, { useState } from 'react';
import './SideNavbar.css'
import { Typography, Paper, Box, Grid } from '@mui/material';
import { BiMenuAltRight, BiSolidBusiness, BiHomeAlt2, BiSolidColorFill, BiFontColor, BiWalletAlt, BiDevices, BiCog } from 'react-icons/bi';
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const Sidebar = ({name, prompt}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const navigate = useNavigate();
  const onClickArea = () =>{
    navigate("/making/area?name=" + name, {state: { name }});
  }
  const onClickPurpose = () =>{
    navigate("/making/purpose?name=" + name, {state: { name }});
  }
  const onClickFontColor = () =>{
    navigate("/making/fontcolor?name=" + name, {state: { name }});
  }
  const onClickBackgroundColor = () =>{
    navigate("/making/backgroundcolor?name=" + name, {state: { name }});
  }
  const onClickStyle = () =>{
    navigate("/making/style?name=" + name, {state: { name }});
  }
  return (
<div className='sidebarall'>
    <Box 
      className={`sidebar ${isHovered ? 'expand' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Grid container direction="column" >
      <Grid item className="nav-header">
        <Link to="/">
        <Typography 
            variant="h6" 
            className="logo" 
            sx={{ opacity: isHovered ? 1 : 0, transition: 'var(--transition)' }}
            >K-Logo Gen</Typography>
            </Link>
        <BiMenuAltRight className="BiMenuAltRight" />
      </Grid>
      <Grid item className="nav-links">
        <ul>
          <li>
            <a onClick={onClickArea}>
              <BiSolidBusiness className='icon'/>
              <span className="title">사업분야</span>
            </a>
          </li>
          <li>
            <a onClick={onClickPurpose}>
              <BiHomeAlt2 className='icon'/>
              <span className="title" >목적</span>
            </a>
          </li>
          <li>
            <a onClick={onClickFontColor}>
              <BiSolidColorFill className='icon'/>
              <span className="title" >글자색상</span>
            </a>
          </li>
          <li>
            <a  onClick={onClickBackgroundColor}>
              <BiSolidColorFill className='icon'/>
              <span className="title">배경색상</span>
            </a>
          </li>
          <li>
            <a  onClick={onClickStyle}>
              <BiFontColor className='icon'/>
              <span className="title">스타일</span>
            </a>
          </li>
          <li>
            <a>
              <BiCog className='icon'/>
              <span className="title" >설정</span>
            </a>
          </li>
        </ul>
        </Grid>
        <Grid item 
        // sx={{
        //         width: 200,
        //         height: 300,
        //         borderRadius: 1,
        //         border: 1,
        //         gap: 2,
        //         bgcolor: '',
        //         '&:hover': {
        //           bgcolor: 'primary.dark',
        //         },
        //       }}
              >
        <Grid container direction="column" justifyContent="flex-end">
            
        <div className='rounded-rectangle'>{prompt}</div>
        </Grid>
        </Grid> 
      
      
      
      </Grid>
    </Box>
    </div>
  );
};

export default Sidebar;
