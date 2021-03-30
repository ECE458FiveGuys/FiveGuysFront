import React, {Component} from "react";
import {MDBContainer, MDBIcon} from "mdbreact";
import filetab_image from "../../../../assets/sheets_filetab_screenshot.png"
import csvtab_image from "../../../../assets/sheets_csvtab_screenshot.png"
import excel_save_image from "../../../../assets/excel_save_screenshot.png"
import "./ImportDoc.css";
import {Accordion, Button, Card} from "react-bootstrap";
import {Divider} from "@material-ui/core";
import HTPNavBar from "../../../Common/HTPNavBar";

class ImportDocumentation extends Component{


    MODEL_FIELDS = {
        Vendor: "Vendor (Required)",
        ModelNumber: "Model-Number (Required)",
        Description: "Short-Description (Required)",
        Comment: "Comment",
        Categories: "Model-Categories",
        SpecialCalibrationSupport: "Special-Calibration-Support",
        CalibrationFrequency: "Calibration-Frequency (Required)"
    }

    MODEL_RULES = {
        Vendor:
            <div>
                <li><strong>Max length</strong> of data is <strong>30 characters</strong></li>
            </div>,
        ModelNumber:
            <div>
                <li><strong>Max length</strong> of data is <strong>40 characters</strong></li>
            </div>,
        Description:
            <div>
                <li><strong>Max length</strong> of data is <strong>100 characters</strong></li>
            </div>,
        Comment:
            <div>
                <li><strong>Max length</strong> of data is <strong>2000 characters</strong></li>
                <li>Can be multiple lines</li>
            </div>,
        Categories:
            <div>
                <li>Must be <strong>space delimited</strong> list of categories the model belongs to</li>
                <li>The categories themselves must <strong>NOT</strong> contain any spaces and must be
                less than 100 characters each</li>
                <li>Each category listed must match a category already in the database</li>
            </div>,
        SpecialCalibrationSupport:
            <div>
                <li>Either "Load-Bank", "Klufe", or empty, depending on the modeel's mode of calibration</li>
                <li>Empty indicates that only simple calibrations are supported in the case the model is calibratable</li>
            </div>,
        CalibrationFrequency:
            <div>
                <li><strong>Max length</strong> of data is <strong>10 characters</strong></li>
                <li>Must either be a positive, nonzero integer, or equal to “N/A“ in
                    the case where the model is non-calibratable
                </li>
            </div>
    }

    INSTRUMENT_FIELDS = {
        Vendor: "Vendor (Required)",
        Model_Number: "Model-Number (Required)",
        Serial_Number: "Serial-Number",
        Asset_Number: "Asset-Tag-Number",
        Comment: "Comment",
        Categories: "Instrument-Categories",
        Calibration_Date: "Calibratoin-Date",
        Calibration_Comment: "Calibration-Comment"
    }

    INSTRUMENT_RULES = {
        Vendor:
            <div>
                <li><strong>Max length</strong> of data is <strong>30 characters</strong></li>
            </div>,
        Model_Number:
            <div>
                <li><strong>Max length</strong> of data is <strong>40 characters</strong></li>
            </div>,
        Serial_Number:
            <div>
                <li><strong>Max length</strong> of data is <strong>40 characters</strong></li>
            </div>,
        Asset_Number:
            <div>
                <li>It is recommended to leave this field empty</li>
                <li>Data entered must be <strong>6 digits</strong></li>
                <li>Data entered must be of a value greater than 100000</li>
                <li>Must be unique and cannot match an existing tag number in the database</li>
                <li>Must be entered in a plain format with no punctuation (Good: 125000, Bad: 125,000 or 125.000)</li>

            </div>,
        Comment:
            <div>
                <li><strong>Max length</strong> of data is <strong>2000 characters</strong></li>
                <li>Can be multiple lines</li>
            </div>,
        Calibration_Date:
            <div>
                {/*<li><strong>Max length</strong> of data is <strong>20 characters</strong></li>*/}
                <li>Must the format MM/DD/YYYY</li>
                <li>If a date is entered, the instrument's model must be calibratable</li>
            </div>,
        Calibration_Comment:
            <div>
                <li><strong>Max length</strong> of data is <strong>2000 characters</strong></li>
                <li>Can be multiple lines</li>
            </div>,
        Categories:
            <div>
                <li>Must be <strong>space delimited</strong> list of categories the model belongs to</li>
                <li>The categories themselves must <strong>NOT</strong> contain any spaces and must be
                    less than 100 characters each</li>
                <li>Each category listed must match a category already in the database</li>
            </div>
    }


    render(){
        let {user, location} = this.props
        return(
            <div>
            {/*<HTPNavBar*/}
            {/*    user={user}*/}
            {/*    location={location}*/}
            {/*/>*/}
            <div className="importguide">
                <MDBContainer>
                    <h1>Import Guide</h1>
                    <Divider horizontal={true} style={{width : 375, marginTop : 20, marginBottom : 20}}/>
                    <div>
                        <body>
                        {/*<p>*/}
                            <h2>File Format</h2>
                            <p>
                            The imported file has to be in UTF-8 RFC4180 .csv format.<br/>
                            To download a .csv using Google Sheets:<br/>
                                <li>Click File->Download->Comma-separated values (.csv, current sheet):</li>
                                <div>
                                    <img src={filetab_image}
                                         className = "images"
                                         // style={{}}
                                    />
                                    <img src={csvtab_image}
                                         className = "images"
                                         // style={{margin:"50px 50px"}}
                                    />
                                </div>

                            To download a .csv using Microsoft Excel:<br/>
                            <li>Click File->Save As then select CSV UTF-8 as the File Format</li>
                            <div>
                                <img src={excel_save_image}
                                     className = "images"
                                />
                            </div>
                            <li>Click Save</li>


                        </p>

                        {/*<p>*/}
                            <h2>General Structure Guidelines</h2>
                            <p>
                            <li>Empty rows are allowed.</li>
                            <li>All data must be within a single line with the exception of the comment column in a
                                Models file, the comment column in an MODELs file, and the calibration-comment
                                column in an MODELs file.</li>
                            <li>Data is case sensitive (ie. “Vendor A” and “vendor a” as two different vendors).</li>
                        </p>

                        {/*<p>*/}
                            <h2>Model File Format</h2>
                            <p>
                            <li>Table MUST include each of the following 7 columns with its specified case sensitive name
                                in the following order (left to right): “Vendor”, ”Model-Number”, ”Short-Description”,
                                 ”Comment”, “Model-Categories”, ”Special-Calibration-Support”, ”Calibration-Frequency”
                            </li>
                        </p>
                            <h4>Data Format Rules:</h4>
                        <p>
                            <Accordion>
                                {Object.keys(this.MODEL_FIELDS).map((key,index) =>
                                        <Card>
                                            <Card.Header style={{position:'relative'}}>
                                                {this.MODEL_FIELDS[key]}
                                                <Accordion.Toggle as={Button} variant="link" eventKey={key}>
                                                    <MDBIcon icon={"plus"}
                                                             className="icon"
                                                             size={'lg'}/>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={key}>
                                                <Card.Body>{this.MODEL_RULES[key]}</Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                )
                                }
                            </Accordion>
                        </p>
                        {/*<p>*/}
                            <h2>Instruments File Format</h2>
                        <p>
                            <li> Table MUST include each of the following 8 columns with its specified case sensitive name
                                in the following order (left to right): “Vendor”, “Model-Number”, “Serial-Number”,
                                “Asset-Tag-Number”, ”Comment”, ”Instrument-Categories” , ”Calibration-Date”,
                                 ”Calibration-Comment”
                            </li>
                            <li>The combination of model number, vendor, and serial number must be unique for each
                                instrument
                            </li>
                            <li>
                                Models identified by model number in conjunction with vendor must already exist
                                in the database.
                            </li>
                            <h4>Data Format Rules:</h4>
                        </p>
                        <p>
                            <Accordion>
                                {Object.keys(this.INSTRUMENT_FIELDS).map((key,index) =>
                                    <Card>
                                        <Card.Header style={{position:'relative'}}>
                                            {this.INSTRUMENT_FIELDS[key]}
                                            <Accordion.Toggle as={Button} variant="link" eventKey={key}>
                                                <MDBIcon
                                                         icon={"plus"}
                                                         className='icon'
                                                         size={'lg'}
                                                         />
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={key}>
                                            <Card.Body>{this.INSTRUMENT_RULES[key]}</Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                )
                                }
                            </Accordion>
                        </p>
                        </body>
                    </div>
                </MDBContainer>
            </div>
            </div>
        )

    }
}

export default ImportDocumentation