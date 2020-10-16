import React,{ useEffect, useState} from 'react';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import Filter from './components/Filter/Filter';
import './App.css';
import Card from './components/Card/Card';

function App(props) {
  console.log('----------->,', window.__initial_data)
  
  const { yearProp, launchProp, landingProp } = props.initialState ? props.initialState : {yearProp:'2020',launchProp:'true',landingProp:'true'}
  console.log(yearProp, launchProp, landingProp,  window.__initial_data)
  const [filter, setFilter] = useState({year:yearProp?yearProp:'',launch:launchProp?launchProp:'',landing:landingProp?landingProp:''});
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    console.log('------filters',filter)
    const { year, launch, landing } = filter;
    const yearFilter = year ? `&launch_year=${year}` : ""
    const launchFilter = launch ? `&launch_success=${launch}` : ""
    const landingFilter = landing ? `&land_success=${landing}` : ""
    axios.get(`https://api.spacexdata.com/v3/launches?limit=100${yearFilter}${launchFilter}${landingFilter}`)
      .then(res => {
        setFlights(res.data)
      })
    
  }, [filter]);


  
  const updateFilterState = (key, value) => {
    console.log(key,value)
    setFilter(prevState => ({
      ...prevState,
      [key]: value
      }));
  
  }

  const { year, launch, landing } = filter;
  return (
    <Container fluid={true} className="App">
      <Row xl="12">
        <Col><h2>Space X Launch Program</h2></Col>
      </Row>
      <Row  xs="12">
        <Col xs="12" sm="3"><Filter
          updateFilter={(key, value) => updateFilterState(key, value)}
          yearProp={year}
          launchProp={launch}
          landingProp={landing} /></Col>
        <Col xs="12" sm="9">
        <Row  xs="12">
            {flights && flights.length > 0 && flights.map(f => <Col md="4" sm="6" xs="12" className="padtop">
              <Card
                missionName={f.mission_name}
                flightNumber={f.flight_number}
                imageURL={f.links.mission_patch_small}
                missionIds={f.mission_id}
                launchYear={f.launch_year}
                launchSuccess={f.launch_success === null ? '' : f.launch_success.toString()}
                launchLanding={f.rocket.first_stage.cores[0].land_success === null? '': f.rocket.first_stage.cores[0].land_success.toString()}
              />
              
            </Col>)}
            
          </Row>
        </Col>
        
        
      </Row>
      <Row xl="12">
        <Col><h2>Developed By Vignesh K B</h2></Col>
      </Row>
      
    </Container>
  );
}

export default App;
