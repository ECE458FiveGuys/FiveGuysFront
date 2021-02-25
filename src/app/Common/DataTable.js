import React, { Component } from "react";
import { MDBDataTable } from 'mdbreact';
import PropTypes from "prop-types";
import Image from "../../assets/Spinner.gif";

export default class DataTable extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let data = {
            columns: this.props.columns,
            rows: this.props.rows
        }
        return !this.props.rows ?
            (<div style={{display: 'flex', justifyContent: 'center', alignItems : 'center'}}>
                <img alt="loading"
                     style={{width: 100, marginTop: 50}}
                     src={Image}/>
            </div>)
            :
            (<MDBDataTable
                autoWidth={false}
                striped
                bordered
                small
                searching={false}
                data={data}
            />)
    }
}

DataTable.propTypes = {
    columns: PropTypes.array.isRequired, // the columns of the datatable
    token: PropTypes.string.isRequired, // the token obtained through login
    rows : PropTypes.array.isRequired
}
