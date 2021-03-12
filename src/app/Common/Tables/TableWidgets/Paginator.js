import React, {Component} from "react";
import PropTypes from "prop-types";
import {MDBCol, MDBNavItem, MDBPageItem, MDBPageNav, MDBPagination, MDBRow} from "mdbreact";

const NUM_PAGE_ICONS = 10

export default class Paginator extends React.Component {

    constructor(props) {
        super(props);
    }

    renderEllipse = () => {return <div style={{display: "flex", alignItems: "flex-end", marginBottom : 5}}>. . .</div>}

    renderPageIcons = () => {
        let {numPages, activePage, onPageChange} = this.props
        let PageIcons = []
        let start = (activePage - (NUM_PAGE_ICONS / 2) > 0) ? activePage - (NUM_PAGE_ICONS / 2) : 1
        let end = activePage + NUM_PAGE_ICONS < numPages ? activePage + NUM_PAGE_ICONS / 2 : numPages
        if (start != 1) PageIcons.push(this.renderEllipse())
        for (let pageNum = start; pageNum <= end; pageNum ++) {
            PageIcons.push(
                <MDBPageItem active={pageNum == activePage}>
                    <MDBPageNav
                        onClick={() => onPageChange(pageNum)}
                    >
                        {pageNum}
                    </MDBPageNav>
                </MDBPageItem>
            )
        }
        if (end < numPages) PageIcons.push(this.renderEllipse())
        return PageIcons
    }

    render() {
        let {onPageChange, activePage, numPages} = this.props
        return(
            <MDBRow>
                <MDBCol>
                    <MDBPagination className="mb-5">
                        <MDBPageItem disabled = {activePage == 1}>
                            <MDBPageNav
                                onClick={() => onPageChange(activePage - 1)}
                                aria-label="Previous">
                                <span aria-hidden="true">Previous</span>
                            </MDBPageNav>
                        </MDBPageItem>
                        {this.renderPageIcons()}
                        <MDBPageItem disabled = {activePage == numPages}>
                            <MDBPageNav
                                onClick={() => onPageChange(activePage + 1)}
                                aria-label="Previous">
                                <span aria-hidden="true">Next</span>
                            </MDBPageNav>
                        </MDBPageItem>
                    </MDBPagination>
                </MDBCol>
            </MDBRow>)
    }
}

Paginator.propTypes = {
    onPageChange : PropTypes.func.isRequired,
    activePage : PropTypes.number.isRequired,
    numPages : PropTypes.number.isRequired
}