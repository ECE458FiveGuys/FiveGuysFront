import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import MainView from './app/MainPage/MainView';
import Import_ExportView from './app/ImportExport/Import_ExportView'
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
            <Route path="/">
              <MainView />
            </Route>
          </Switch>
          <Switch>
            <Route path="/ImportExport">
              <Import_ExportView />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
  );
}

export default App;