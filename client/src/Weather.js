import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Current weather</Link>
          <Link to="/forecast">Forcast</Link>
        </nav>
        <Route path="/" exact component={OneDayWhether}></Route>
        <Route path="/forecast" component={ForcastBy3HouresFor5Days}></Route>
      </div>
    </Router>
  );
}

class OneDayWhether extends React.Component {
  constructor() {
    super();

    this.state = {
      data: null
    }
  }

  componentDidMount() {
    fetch("http://localhost:9000/currentWeather")
      .then(res => res.json())
      .then(data =>{
        data.imgSrc = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

        this.setState({data: data});
      }) 
      .catch(err => console.log(err));
  }

  render() {
    if (!this.state.data) {
      return (
        <div className='one-day-forcast'>
          <h1>Weather</h1>
        </div>
      );
    }

    return (
      <div className='one-day-forcast'>
        <h1>Current Weather for {this.state.data.name}</h1>
        <div className="weatherElement">
          <img className="weatherImg" src={this.state.data.imgSrc} alt=""></img>
          <div className="weatherDescription">{this.state.data.weather[0].description}</div>
          <div className='temp'>{this.state.data.main.temp}&deg;C</div>
          <div className="temps">
            <div className="minTemp">{this.state.data.main.temp_min}&deg;C</div>
            <div className="maxTemp">{this.state.data.main.temp_max}&deg;C</div>
          </div>
        </div>
      </div>
    );
  }
}

class ForcastBy3HouresFor5Days extends React.Component {
  constructor() {
    super();
    
    this.state = {
      data: null
    };
  }

  async componentDidMount() {
    fetch("http://localhost:9000/forecastBy3Hours")
      .then(res => res.json())
      .then(data => {
        data.list.forEach(day => {
          day.list.forEach(w => {
            w.urlToImg = "https://openweathermap.org/img/wn/" + w.weather[0].icon + "@2x.png";
          })
        });

        this.setState({data: data});
      })
      .catch(err => console.log(err));
  }

  render() {
    if (!this.state.data) {
      return (
        <div>
          <h1>Forcast by 3 hours</h1>
        </div>
      )
    }

    return (
      <div>
        <h1>Forcast by 3 hours for {this.state.data.city.name}</h1>
        <div>
          {this.state.data.list.map(day =>
            <div key={day.name} className="weatherDay">
              <h3>{day.formated}</h3>
              {day.list.map(w =>
                <div key={w.dt_txt} className="weatherElement">
                  <img src={w.urlToImg} alt=""></img>
                  <div className="weatherDescription">{w.weather[0].description}</div>
                  <div className="temps">
                    <div className="minTemp" >{w.main.temp_min}&deg;C</div>
                    <div className="maxTemp">{w.main.temp_max}&deg;C</div>
                  </div>
                  <div className="timeRange">Time range: <br/> {w.dtFromFormated} - {w.dtToFormated}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
