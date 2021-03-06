import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import ImportExportView from './app/ImportExport/ImportExportView'
import MainView from './app/Pages/MainPage/MainView';
import Login from "./auth/Login";
import NotFound from "./auth/NotFound";
import {StorageKeys} from "./utils/enums";
import {User} from "./utils/dtos";
import ModelDetailView from "./app/Pages/ModelDetailPage/ModelDetailView";
import InstrumentDetailView from "./app/Pages/InstrumentDetailPage/InstrumentDetailView";
import CategoryTabView from "./app/Pages/CategoryPage/CategoryTabView";
import LoadBankMain from "./app/Pages/LoadBankPage/LoadBankMain";
import OAuthRedirect from "./auth/OAuthRedirect";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: this.getToken(),
      user: this.getUser()
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
    if (!this.state.token || !this.state.user) {
      return <BrowserRouter>
                <Switch>
                <Route exact path = "/oauth/consume"
                       render={(props) => <OAuthRedirect
                                              history = {props.history}
                                              code={new URLSearchParams(props.location.search).get("code")}
                                              setToken={this.saveToken}
                                              setUser={this.saveUser}
                                            />}>
                </Route>
                <Route>
                  <Login setToken={this.saveToken}
                        setUser={this.saveUser}/>
                </Route>
                </Switch>
              </BrowserRouter>
    }
    return (
        <div className="wrapper">
          <BrowserRouter>
            <Switch>
              <Route exact path="/"
                    render={(props) => <MainView history={props.history}
                                                 token={this.state.token}
                                                 user={this.state.user}/>}>
              </Route>
              <Route path="/models/:id"
                     render={(props) => (<ModelDetailView id={props.match.params.id}
                                                          token={this.state.token}
                                                          user={this.state.user}/>)} >
              </Route>
              <Route  path="/instruments/:id"
                      render={(props) => (<InstrumentDetailView id={props.match.params.id}
                                                                history={props.history}
                                                           token={this.state.token}
                                                           user={this.state.user}/>)} >
              </Route>
              <Route path="/import-export">
                <ImportExportView token={this.state.token}
                                  user={this.state.user}/>
              </Route>
              <Route path="/categories/">
                <CategoryTabView token={this.state.token}
                                 user={this.state.user}/>
              </Route>

              <Route path="/load-bank/:id"
                     render = {(props) => (<LoadBankMain  instrumentId={props.match.params.id}
                                                          history={props.history}
                                                          user={this.state.user}
                                                          token={this.state.token}/>)}>
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