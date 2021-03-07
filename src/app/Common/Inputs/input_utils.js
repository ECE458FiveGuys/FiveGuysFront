export let handleFormChange = (context) => (e) => {
    let name = e.target.name;
    let value = e.target.value;
    context.setState({[name]: value})
}