import {User} from "../utils/dtos";
import UserRequests from "../controller/requests/user_requests";

export let getUserCallBack = (context) => (json) => {
    let user = User.fromJson(json[0])
    if (context.props.history) context.props.history.push("/")
    context.props.setUser(user)
}

export let loginCallBack = (context) => (json) => {
    const tokenVal = json["auth_token"]
    UserRequests.retrieveUser(tokenVal, context.state.username, getUserCallBack(context))
    context.props.setToken(tokenVal);
}
export let loginErrorCallBack = (context) => (errorMessage) => {
    let newState = {error: errorMessage}
    context.setState(newState)
}