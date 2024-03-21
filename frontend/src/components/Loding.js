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
    <div>이미지를 생성중입니다</div>
    <dib>평균적으로 2분정도 소요됩니다</dib>
        </div>
    ) ;

};
export default Loding;