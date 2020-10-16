import React from 'react';


import './Card.css';

function Card(props) {

    const { launchYear, launchSuccess ,missionIds,launchLanding,missionName,flightNumber,imageURL } = props
  return (
      <div className="CustomCard">
          <div ><img className="CustomCard-Image" src={'https://live.staticflickr.com/65535/49235364922_e55ceb61be_o.jpg'} alt="spaceX" /></div>
          <div className="CustomCard-Name">
              {missionName} #{flightNumber}
          </div>
          <div className="CustomCard-ID">
              Mission Ids :
              <ul>
              {missionIds&& missionIds.length>0 && missionIds.map((item, i) => (
                                        <li key={i}>{item}</li>    
                                    ))}
              </ul>
              
          </div>
          <div className="CustomCard-Desc">
              <div>Launch Year: <span>{launchYear}</span></div>
              <div>Successful Launch: <span>{launchSuccess}</span></div>
              <div>Successful Landing: <span>{launchLanding}</span> </div>
          </div>
          
    </div>
  );
}

export default Card;
