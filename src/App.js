import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import ImportExportView from './app/ImportExport/ImportExportView'
import MainView from './app/Pages/MainPage/MainView';
import Login from "./auth/Login";
import NotFound from "./auth/NotFound";
import {StorageKeys} from "./utils/enums";
import {User} from "./utils/dtos";
import NavBar from "./app/Common/NavBar";
import ModelDetailView from "./app/Pages/ModelDetailPage/ModelDetailView";
import InstrumentDetailView from "./app/Pages/InstrumentDetailPage/InstrumentDetailView";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: this.getToken()
    }
    this.saveToken = this.saveToken.bind(this)
  }

    getToken = () => {
        const tokenString = localStorage.getItem(StorageKeys.TOKEN);
        return JSON.parse(tokenString);
    };

    saveToken = userToken => {
        localStorage.setItem(StorageKeys.TOKEN, JSON.stringify(userToken));
        this.setState({token: userToken})
    };

    getUser = () => {
      const userString = localStorage.getItem(StorageKeys.USER);
      return userString ? User.fromJson(JSON.parse(userString)) : undefined
    };

    saveUser = user => {
      localStorage.setItem(StorageKeys.USER, JSON.stringify(user));
      this.setState({user: user})
    };

  render() {
    if (!this.state.token) {
      return <Login setToken={this.saveToken}/>
    }
    return (
        <div className="wrapper">
          <BrowserRouter>
            <Switch>
              <Route exact path="/">
                <MainView token={this.getToken()}
                          user={this.getUser()}/>
              </Route>
              <Route path="/models/">
                <ModelDetailView token={this.getToken()}
                                 user={this.getUser()}/>
              </Route>
              <Route path="/instruments/">
                <InstrumentDetailView token={this.getToken()}
                                      user={this.getUser()}/>
              </Route>
              <Route path="/ImportExport">
                  <ImportExportView token={this.getToken()}
                                    user={this.getUser()}/>
              </Route>
              <Route>
                <NotFound/>
              </Route>
            </Switch>
          </BrowserRouter>
        </div>
    );
  }
}

export default App;