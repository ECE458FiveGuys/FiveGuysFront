import RequestUtils from "./request_utils";
import {AUTH_URLS, METHODS, URLS} from "../strings";
import ErrorParser from "../../app/Pages/CreateFunctions/ErrorParser";

export default class UserRequests {
    static params;
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

    static async getAllUsers(token)
    {
        let header = RequestUtils.buildTokenHeader(token)
        //let params = {}
        return await RequestUtils.assisted_simple_fetch(AUTH_URLS.USERS,
            METHODS.GET, header)
    }

    static async deactivateUser(token,
                             pk)
    {
        let header = RequestUtils.buildTokenHeader(token)
        //let params = {}
        return await RequestUtils.assisted_simple_fetch(AUTH_URLS.USERS + pk + '/deactivate/',
            METHODS.POST,
            header)
    }

    static async passwordChange(token,
                                password_data,
                                callBack = () => {},
                                errorMessageCallBack = () => {}) {
        let header = RequestUtils.buildTokenHeader(token)
        let data = password_data
        RequestUtils.assistedFetch(AUTH_URLS.PASSWORD_CHANGE,
            METHODS.POST,
            callBack,
            errorMessageCallBack,
            header,
            undefined,
            data)
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

    static async changeAdminStatus(token, pk, adminBool)
    {
        let header = RequestUtils.buildTokenHeader(token)
        //let params = {}
        //header['Content-Type'] = 'application/json'
        let data = adminBool
        return await RequestUtils.assisted_simple_fetch(AUTH_URLS.USERS + pk + '/update_admin_status/',
            METHODS.POST,
            header,
            {},
            data)
    }

    static async changeGroups(token, pk, groupChanged)
    {
        let header = RequestUtils.buildTokenHeader(token)
        header['Content-Type'] = 'application/json'
        let data = {
            "groups":
                groupChanged
            ,
            "pk": pk,
        }
        JSON.stringify(data)
        return await RequestUtils.assisted_simple_fetch(AUTH_URLS.USERS + pk + "/",
            METHODS.PATCH,
            header,
            {},
            JSON.stringify(data))
    }

}