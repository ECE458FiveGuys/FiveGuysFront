import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import MainView from './app/MainPage/MainView';

function App() {
  const [token, setToken] = useState();

    // if(!token) {
    //     return <Login setToken={setToken} />
    // }

    return (
      <div className="wrapper">
        <BrowserRouter>
          <Switch>
            <Route path="/main_view">
              <MainView />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
  );
}

export default App;