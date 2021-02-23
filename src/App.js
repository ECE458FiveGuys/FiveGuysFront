import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import MainView from './app/MainPage/MainView';
import ImportExportView from './app/ImportExport/ImportExportView'
import Login from "./auth/Login";
import NotFound from "./auth/NotFound";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token : this.getToken()
        }
        this.saveToken = this.saveToken.bind(this)
    }

    getToken = () => {
        const tokenString = localStorage.getItem('token');
        return JSON.parse(tokenString);
    };

    saveToken = userToken => {
        localStorage.setItem('token', JSON.stringify(userToken));
        this.setState({token: userToken})
    };

    render() {
        if (!this.state.token) {
            return <Login setToken={this.saveToken} />
        }
        return (
          <div className="wrapper">
            <BrowserRouter>
              <Switch>
                  <Route exact path="/">
                    <MainView token={this.state.token}/>
                  </Route>
                  <Route path="/ImportExport">
                      <ImportExportView token={this.state.token}/>
                  </Route>

                  <Route>
                    <NotFound/>
                  </Route>

              </Switch>
            </BrowserRouter>
          </div>
      )
    }
}

export default App;