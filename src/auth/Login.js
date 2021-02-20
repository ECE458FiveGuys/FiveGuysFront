import React from 'react';
import './Login.css';
import PropTypes from "prop-types";
import {URLS, METHODS} from "../strings.js"
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

async function loginUser(credentials) {
    return fetch(URLS.LOGIN, {
        method: METHODS.POST,
        body: credentials,
        mode: "no-cors"
    })
        .then(data => {
            data.json()
        })
        .catch(e => console.log(e))
}

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
        console.log(token)
        this.props.setToken(token);
    }

   render() {
       return (
               <MDBContainer>
                   <MDBRow>
                       <MDBCol md="6">
                           <form>
                               <p className="h5 text-center mb-4">Sign in</p>
                               <div className="grey-text">
                                   <MDBInput label="Type your email"
                                             icon="envelope"
                                             group type="email"
                                             validate error="wrong"
                                             success="right"
                                             onChange={e =>
                                                 this.setState(
                                                     {username : e.target.value})
                                                 }
                                   />
                                   <MDBInput label="Type your password"
                                             icon="lock"
                                             group type="password"
                                             validate
                                             onChange={e =>
                                                 this.setState(
                                                     {password : e.target.value}
                                                     )
                                             }
                                             />
                               </div>
                               <div className="text-center">
                                   <MDBBtn onClick={this._handleSubmit}>Login</MDBBtn>
                               </div>
                           </form>
                       </MDBCol>
                   </MDBRow>
               </MDBContainer>
       )
       }
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}