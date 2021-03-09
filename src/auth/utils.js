import {User} from "../utils/dtos";
import UserRequests from "../controller/requests/user_requests";
import RequestUtils from "../controller/requests/request_utils";
import {AUTH_URLS, METHODS} from "../controller/strings";

export let getUserCallBack = (context) => (json) => {
    let user = User.fromJson(json)
    if (context.props.history) context.props.history.push("/")
    context.props.setUser(user)
}

export let loginCallBack = (context) => (json) => {
    const tokenVal = json["auth_token"]
    RequestUtils.assistedFetch(AUTH_URLS.SELF, METHODS.GET, getUserCallBack(context), loginErrorCallBack(context), RequestUtils.buildTokenHeader(tokenVal))
    context.props.setToken(tokenVal);
}
export let loginErrorCallBack = (context) => (errorMessage) => {
    let newState = {error: errorMessage}
    context.setState(newState)
}