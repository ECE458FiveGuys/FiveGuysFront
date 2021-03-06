import React from 'react';
import './Login.css';
import PropTypes from "prop-types";
import {URLS, METHODS, AUTH_URLS} from "../controller/strings.js"
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import Image from "../assets/hpt_logo.png"
import {Gradient} from "react-gradient"
import RequestUtils from "../controller/requests/request_utils";
import {Divider} from "@material-ui/core";
import {loginCallBack, loginErrorCallBack} from "./auth_utils";

async function loginUser(credentials, callBack, errorMessageCallBack) {
    RequestUtils.performFetch(AUTH_URLS.LOGIN, METHODS.POST, callBack, errorMessageCallBack, {}, {}, credentials)
}

const gradients = [
    ['#aabbf8', '#ffffff'],
    ['#a2e2ef', '#25c668'],
];

export default class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username : "",
            password : "",
            error : undefined
        }
    }

    // log in and get token, then after that, get the corresponding user object representing who just logged in
    // save both token and user in local storage

    _handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({error: undefined},
            () => {
            // run callback chain

            loginUser({
                    username: this.state.username,
                    password: this.state.password
                },
                loginCallBack(this),
                loginErrorCallBack(this)
            )
        })
    }

   render() {
       let {error} = this.state
       let ErrorMessage = !error ? <text></text> : <text className={"text-danger"}>{error}</text>
       return (
           <Gradient
               className={"fill-window"}
               gradients={ gradients } // required
               property="background"
               duration={ 3000 }
               angle="45deg"
           >
             <MDBContainer>
               <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 200}}>
                   <MDBCol md="5">
                       <form>
                           <p className="h2-responsive">Welcome!</p>
                           <label htmlFor="defaultFormLoginEmailEx" className="black-text">
                               Your username
                           </label>
                           <input type="text" id="defaultFormLoginEmailEx"
                                  className="form-control"
                                  onChange={e => this.setState({username : e.target.value})}
                           />
                           <br />
                           <label htmlFor="defaultFormLoginPasswordEx" className="black-text">
                               Your password
                           </label>
                           <input type="password"
                                  id="defaultFormLoginPasswordEx"
                                  className="form-control"
                                  onChange={e => this.setState({password : e.target.value})}/>
                           {ErrorMessage}
                           <div className="text-center mt-4">
                               <MDBBtn color="dark-green"
                                       type="submit"
                                       onClick={this._handleSubmit}>
                                   Login
                               </MDBBtn>
                           </div>
                       </form>
                   </MDBCol>
                   <Divider style={{marginLeft : 40, marginRight : 40}} orientation = 'vertical' flexItem={true}/>
                   <a href={URLS.OAUTH_URL}>
                       <MDBBtn color="dark-green"
                               type="submit">
                           Oauth Login
                       </MDBBtn>
                   </a>
                   <div style={{justifyContent: 'center', alignItems: 'center', marginLeft: 50}}>
                       <img alt="logo"
                            style={{textAlign: 'center', width: 300}}
                            src={Image}/>
                   </div>
               </MDBRow>
           </MDBContainer>
           </Gradient>
       )
       }
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired
}