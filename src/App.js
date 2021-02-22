import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import MainView from './app/MainPage/MainView';
import InstrumentDetailView from './app/InstrumentDetailPage/InstrumentDetailView'
import ModelDetailView from './app/ModelDetailPage/ModelDetailView'
import Login from "./auth/Login";

function App() {
  const [token, setToken] = useState();

    // if(!token) {
    //     return <Login setToken={setToken} />
    // }

    return (
      <div className="wrapper">
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <MainView token={token}/>
            </Route>
            <Route path="/model-details/">
              <ModelDetailView token={token}/>
            </Route>
            <Route path="/instrument-details/">
              <InstrumentDetailView token={token}/>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
  );
}

export default App;