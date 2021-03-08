import RequestUtils from "./request_utils";
import {AUTH_URLS, METHODS, URLS} from "../strings";
import ErrorParser from "../../app/Pages/MainPage/CreateFunctions/ErrorParser";

export default class UserRequests {
    static async retrieveUser(token,
                              username,
                              callBack = (json) => json,
                              errorMessageCallBack = (errorMessage) => errorMessage)
    {
        let params = {"username" : username}
        let header = RequestUtils.buildTokenHeader(token)

        RequestUtils.assistedFetch(AUTH_URLS.USERS,
            METHODS.GET,
            callBack,
            errorMessageCallBack,
            header,
            params)
    }

    static async addUser(token, name, username, email, password, callBack = (json) => json){
        let TokenProperForm = 'Token ' + token
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization':TokenProperForm, 'Accept':'application/json'},
            body: JSON.stringify({username: username, name: name, email: email, password: password, is_active: true})
        };
        let returnArray = []
        const response = await fetch(AUTH_URLS.USERS, requestOptions)
            .then(response => {
                return response.text()})
            .then(json => { //success
                if (json.includes('"id"')) {
                    returnArray =
                        [
                            'Success! The user was added',
                            'Name : '+ name,
                            'Username : '+ username,
                            'Email : '+ email,
                        ]
                }
                else {
                    returnArray = ErrorParser.parse(json)
                }
            })
            .catch((error) => { //failure
                returnArray = error
            });
        console.log(returnArray)
        callBack(returnArray)
    }
}