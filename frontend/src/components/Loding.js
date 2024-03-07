import { Blocks } from 'react-loader-spinner';
import React from 'react';

const Loding = () => {
   
    return ( 
        <div className='loding container '>
            <Blocks
            height="150"
                width="150"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
    />
        </div>
    ) ;

};
export default Loding;