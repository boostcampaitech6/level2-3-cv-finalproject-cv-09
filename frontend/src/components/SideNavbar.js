import React, { useState } from 'react';
import './SideNavbar.css'
import { Typography, Paper, Box, Grid } from '@mui/material';
import { BiMenuAltRight, BiSolidBusiness, BiHomeAlt2, BiSolidColorFill, BiFontColor, BiWalletAlt, BiDevices, BiCog } from 'react-icons/bi';

const Sidebar = (title) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    
    <Box 
      className={`sidebar ${isHovered ? 'expand' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Grid container direction="column" >
      <Grid item className="nav-header">
        <Typography 
            variant="h6" 
            className="logo" 
            sx={{ opacity: isHovered ? 1 : 0, transition: 'var(--transition)' }}
            >K-Logo Gen</Typography>
        <BiMenuAltRight className="BiMenuAltRight" />
      </Grid>
      <Grid item className="nav-links">
        <ul>
          <li>
            <a href="#">
              <BiSolidBusiness className='icon'/>
              <span className="title">사업분야</span>
            </a>
          </li>
          <li>
            <a href="#">
              <BiHomeAlt2 className='icon'/>
              <span className="title">뭐하지</span>
            </a>
          </li>
          <li>
            <a href="#">
              <BiSolidColorFill className='icon'/>
              <span className="title">배경색</span>
            </a>
          </li>
          <li>
            <a href="#">
              <BiFontColor className='icon'/>
              <span className="title" >글자색</span>
            </a>
          </li>
          <li>
            <a href="#">
              <BiCog className='icon'/>
              <span className="title">Setting</span>
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
            
        <div class='rounded-rectangle'> </div>
        </Grid>
        </Grid> 
      
      
      
      </Grid>
    </Box>
  );
};

export default Sidebar;
