import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import ImportExportView from './app/Pages/ImportExport/ImportExportView'
import MainView from './app/Pages/MainPage/MainView';
import Login from "./auth/Login";
import MessagePage from "./auth/MessagePage";
import {StorageKeys} from "./utils/enums";
import ModelDetailView from "./app/Pages/DetailPages/ModelDetailPage/ModelDetailView";
import InstrumentDetailView from "./app/Pages/DetailPages/InstrumentDetailPage/InstrumentDetailView";
import CategoryTabView from "./app/Pages/CategoryPage/CategoryTabView";
import LoadBankMain from "./app/Pages/LoadBankPage/LoadBankMain";
import OAuthRedirect from "./auth/OAuthRedirect";
import ImportDocumentation from "./app/Pages/ImportExport/Widgets/ImportDocumentation";
import UserSettingsView from "./app/Pages/UserSettingsPage/UserSettingsView";
import CreateUser from "./app/Pages/CreateFunctions/CreateUser";
import UserTableView from "./app/Pages/UsersPage/UserTableView";
import KlufeWizardMain from "./app/Pages/KlufeWizardPage/KlufeWizardMain";
import {getToken, getUser, Logout} from "./auth/auth_utils";
import {AUTH_URLS, METHODS} from "./controller/strings";
import RequestUtils from "./controller/requests/request_utils";
import history from "./auth/history";
import SortableComponent from "./app/Common/Forms/CustomFormGenerator";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: getToken(),
      user: getUser()
    }
    if (this.state.token) this.removeTokenIfInvalid()
    this.saveToken = this.saveToken.bind(this)
  }

  removeTokenIfInvalid = () => {
      RequestUtils.performFetch(AUTH_URLS.SELF, METHODS.GET, () => {},
          () => {this.setState({token : undefined, user : undefined},
              () => {
              Logout()
              })},
          RequestUtils.buildTokenHeader(this.state.token))
  }

  saveToken = userToken => {
    localStorage.setItem(StorageKeys.TOKEN, JSON.stringify(userToken));
    this.setState({token: userToken})
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
          <BrowserRouter history={"history"}>
            <Switch>
              <Route exact path="/"
                    render={(props) => <MainView history={props.history}
                                                 location={props.location}
                                                 token={this.state.token}
                                                 user={this.state.user}/>}>
              </Route>
              <Route path="/models/:id"
                     render={(props) => (<ModelDetailView id={props.match.params.id}
                                                          location={props.location}
                                                          history={props.history}
                                                          token={this.state.token}
                                                          user={this.state.user}/>)} >
              </Route>
              <Route  path="/instruments/:id"
                      render={(props) => (<InstrumentRoute id={props.match.params.id}
                                                                location={props.location}
                                                                history={props.history}
                                                               token={this.state.token}
                                                               user={this.state.user}/>)} >
              </Route>
              <Route path="/import-export"
                     render={(props) => (<ImportExportView location={props.location}
                                                           history={props.history}
                                                           token={this.state.token}
                                                           user={this.state.user}/>)}>
              </Route>
              <Route path="/categories/"
                     render={(props) => (<CategoryTabView location={props.location}
                                                          token={this.state.token}
                                                          user={this.state.user}/>)}>
              </Route>
              <Route path="/users"
                     render={(props) => (<UserTableView location={props.location}
                                                           token={this.state.token}
                                                           user={this.state.user}/>)}>
              </Route>

              <Route path="/create-user/">
                <CreateUser token={this.state.token}
                            user={this.state.user}/>
              </Route>
              <Route path="/documentation">
                <ImportDocumentation
                                  token={this.state.token}
                                  user={this.state.user}/>
              </Route>
              <Route path="/user-settings"
                     render={(props) => (<UserSettingsView location={props.location}
                                                          token={this.state.token}
                                                          user={this.state.user}/>)}>
              </Route>
                <Route path={"/permission-change"}>
                    <MessagePage text={"Hmm, looks like your permissions have changed. Let's head back to the main page."}/>
                </Route>
                <Route path="/create-custom-form"
                       render={(props) => (<SortableComponent location={props.location}
                                               token={this.state.token}
                                               user={this.state.user}/>)}>
                </Route>
              <Route>
                <MessagePage text={"Sorry, this page does not exist."}/>
              </Route>
            </Switch>
          </BrowserRouter>
        </div>
    );
  }
}

export default App;



class InstrumentRoute extends Component {
  constructor(props) {
    super(props);
  }

  addToParentPath(id, path) {
      return `/instruments/${id}/${path}`
  }

  render() {
    let {id, location, history, token, user} = this.props
    return <Switch>
              <Route exact path={"/instruments/" + id}>
                <InstrumentDetailView id={id}
                                 location={location}
                                 history={history}
                                 token={token}
                                 user={user}/>
              </Route>
              <Route path={this.addToParentPath(id, "load-bank/")}>
                <LoadBankMain  instrumentId={id}
                               location={location}
                               history={history}
                               user={user}
                               token={token}/>
              </Route>
              <Route path={this.addToParentPath(id, "klufe-wizard/")}>
                <KlufeWizardMain  instrumentId={id}
                               location={location}
                               history={history}
                               user={user}
                               token={token}/>
            </Route>

    </Switch>
  }

}