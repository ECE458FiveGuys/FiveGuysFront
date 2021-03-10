export let handleFormChange = (context) => (e) => {
    let name = e.target.name;
    let value = e.target.value;
    context.setState({[name]: value})
}

export let handleFieldValueChange = (context, callBack) => (name) => (value) => {
    if (!context.state.fields) context.state.fields = {}
    context.state.fields[name] = value
    context.setState(context.state, callBack)
}