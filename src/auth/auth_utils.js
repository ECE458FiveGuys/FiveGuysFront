import {User} from "../utils/dtos";
import RequestUtils from "../controller/requests/request_utils";
import {AUTH_URLS, METHODS} from "../controller/strings";
import {StorageKeys} from "../utils/enums";

export let getUserCallBack = (context) => (json) => {
    let user = User.fromJson(json)
    if (context.props.history) context.props.history.push("/")
    context.props.setUser(user)
}

export let loginCallBack = (context) => (json) => {
    const tokenVal = json["auth_token"]
    RequestUtils.performFetch(AUTH_URLS.SELF, METHODS.GET, getUserCallBack(context), loginErrorCallBack(context), RequestUtils.buildTokenHeader(tokenVal))
    context.props.setToken(tokenVal);
}

export let loginErrorCallBack = (context) => (errorMessage) => {
    let newState = {error: errorMessage}
    context.setState(newState)
}

export const getToken = () => {
    const tokenString = localStorage.getItem(StorageKeys.TOKEN);
    return JSON.parse(tokenString);
};

export const getUser = () => {
    const userString = localStorage.getItem(StorageKeys.USER);
    return userString ? User.fromJson(JSON.parse(userString)) : undefined
};

export function Logout () {
    localStorage.removeItem(StorageKeys.TOKEN)
    localStorage.removeItem(StorageKeys.USER)
    if (window && window.location) window.location.reload(true);
}

export function UpdateUser (user) {
    localStorage.setItem(StorageKeys.USER, JSON.stringify(user))
    if (window && window.location) window.location.reload(true);
}