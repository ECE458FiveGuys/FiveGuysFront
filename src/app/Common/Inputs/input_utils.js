export let handleFormChange = (context) => (e) => {
    let name = e.target.name;
    let value = e.target.value;
    context.setState({[name]: value})
}

export let handleInputValueChange = (context, callBack) => (name) => (value) => {
    context.setState({[name]: value}, callBack)
}