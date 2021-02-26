import React from 'react';
import './Login.css';
import PropTypes from "prop-types";
import {URLS, METHODS} from "../controller/strings.js"
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import Image from "../assets/hpt_logo.png"
import {Gradient} from "react-gradient"
import RequestUtils from "../controller/requests/request_utils";
import {User} from "../utils/dtos";
import UserRequests from "../controller/requests/user_requests";

async function loginUser(credentials, callBack, errorMessageCallBack) {
    RequestUtils.assistedFetch(URLS.LOGIN, METHODS.POST, callBack, errorMessageCallBack, {}, {}, credentials)
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
            // setup callbacks

            let getUserCallBack = (json) => {
                let user = User.fromJson(json[0])
                this.props.setUser(user)
            }
            let loginCallBack = (json) => {
                const tokenVal = json["auth_token"]
                UserRequests.retrieveUser(tokenVal, this.state.username, getUserCallBack)
                this.props.setToken(tokenVal);
            }
            let loginErrorCallBack = (errorMessage) => {
                let newState = {error: errorMessage}
                this.setState(newState)
            }

            // run callback chain

            loginUser({
                    username: this.state.username,
                    password: this.state.password
                },
                loginCallBack,
                loginErrorCallBack
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