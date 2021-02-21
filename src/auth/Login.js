import React from 'react';
import './Login.css';
import PropTypes from "prop-types";
import {URLS, METHODS} from "../strings.js"
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import Image from "../assets/hpt_logo.png"
import {Gradient} from "react-gradient"

async function loginUser(credentials) {
    return fetch(URLS.LOGIN, {
        method: METHODS.POST,
        body: credentials
    })
        .then(data => {
            data.json()
        })
        .catch(e => console.log(e))
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
            password : ""
        }
    }

    _handleSubmit = async (e) => {
        e.preventDefault();
        const token = await loginUser({
            username: this.state.username,
            password: this.state.password
        });
        this.props.setToken(token);
    }

   render() {
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
    setToken: PropTypes.func.isRequired
}