import React from 'react';

import './Button.css';

function Btn(props) {
  const { text, status, handleClick, key, toUpdate } = props;
 
    
    console.log(text)


    const buttonActive = status ? "-active" : ""
  return (
    <button className={`custombtn${buttonActive}`}
    onClick={() => { handleClick(toUpdate,text) }}>{text}</button>
  );
}

export default Btn;
