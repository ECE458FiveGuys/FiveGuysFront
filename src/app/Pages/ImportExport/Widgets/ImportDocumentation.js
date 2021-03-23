import React, {Component} from "react";
import {MDBContainer} from "mdbreact";

class ImportDocumentation extends Component{

    render(){
        return(
            
            <MDBContainer>
                <h1>Import Documentation</h1>
                <div>
                    <body>
                    <p>
                    <h2>File Format and Structure</h2>
                    On Import, admin will upload either models or instruments file via a corresponding route (more details below). The file has to be in UTF-8 RFC4180 .csv format (exported by default from excel by going to file -> save as ->CSV UTF-8 or from Google sheets by going to File->download-> “comma separated values (.csv current sheet)”). The system will be able to handle byte order marks generated by excel and google sheets, as well as empty rows created by deleting cells from a CSV opened in excel or google sheets.

                    Upload will be done via 2 routes, 1 to upload and process CSV file with models and 1 to upload and process CSV file with instruments. In this scenario the only uniqueness/validity checks will be performed on items already in the database, so if instruments file is uploaded before model file and some of the instruments reference models in model file, an error will be thrown.

                    On export, the user may select which table they want to export.

                    All fields are case-sensitive meaning that when checking uniqueness in the database fields such as “vendor” will treat “Vendor A” and “vendor a” as two different vendors

                    Column names are also case-sensitive

                    All fields except those in Comment column in Models file and Comment and Calibration-Comment columns in Instruments file must be single line fields
                    </p>
                    <p>
                    <h2>Models File Format</h2>
                    The table will be 7 columns wide,  if more columns are provided  only the columns with the column names exactly matching the names specified below will be processed:

                    The first row will contain (case sensitive) Column names in the following order (from left to right). “Vendor”,”Model-Number”,”Short-Description”,”Comment”,“Model-Categories”,”Load-Bank-Support”,”Calibration-Frequency”

                    An absence of any of the columns above will result in an error
                    </p>
                    <p>
                    <h3>Vendor Column:</h3>
                    Max length of data within the vendors column is 30 characters

                    The vendor field is required in every row
                    </p>
                    <p>
                    <h3>Model-Number Column:</h3>
                    Max length of data within the Model-Number column is 40 characters

                    The model number field is required in every row
                    </p>
                    <p>
                    <h3>Short-Description Column:</h3>
                    Max length of data within the Short-Description column is 100 characters

                    The Short-Description field is required in every row
                    </p>
                    <p>
                    <h3>Comment Column:</h3>
                    Max length of data within the Comment column is 2000 characters

                    Can be multiline
                    </p>
                    <p>
                    <h3>Model-Categories Column:</h3>
                    Contains space delimited list of categories the model belongs to. As per requirement 2.11 all categories are “whitespace free” meaning that they do not contain any spaces

                    Data within Categories column must be at most 100 characters

                    Data within categories column must match already existing categories
                    </p>
                    <p>
                    <h3>Load-Bank-Support Column:</h3>

                    “Y” if the model is calibratable via load bank wizard. Empty otherwise

                    At most 1 character in length
                    </p>
                    <p>
                    <h3>Calibration-Frequency Column:</h3>
                    Data within Calibration-Frequency column must be at most 10 characters

                    The Calibration-Frequency is required in every row

                    The data in Calibration-Frequency field must either be a positive, nonzero integer, or must equal to “N/A“ in the case where the model is non-calibratable
                    </p>
                    <p>
                    <h3>Errors:</h3>
                    If a model number-vendor combination is not unique, meaning there is a row in the table with the same Model-Number and Vendor fields, or if there is a model document in the database with the same model number and vendor fields an error message indicating this mistake will be thrown

                    If any of the fields described above do not match the listed specifications an error message indicating this mistake will be thrown.
                    </p>
                    <p
                    >
                    <h2>Summary:</h2>
                    <p>
                        Field Name: Vendor
                        Character Max: 30
                        Required: Yes
                    </p>
                    <p>
                        Field Name: Model-Number
                        Character Max: 40
                        Required: Yes
                    </p>

                    <p>
                        Field Name: Short-Description
                        Character Max: 100
                        Required: Yes
                    </p>
                    <p>
                        Field Name: Comment
                        Character Max: 2000
                        Required: No
                    </p>
                    <p>
                        Field Name: Model-Categories
                        Character Max: 100
                        Format Requirements: Space separated category names
                        Required: No
                    </p>
                    <p>
                        Field Name: Load-Bank-Support
                        Character Max: 1
                        Format Requirements: “Y” if model supports load bank, blank otherwise
                        Required: No
                    </p>
                    <p>
                        Field Name: Calibration-Frequency
                        Character Max: 10
                        Format Requirements: Either a positive integer or “N/A” if model non-callibrable
                        Required: Yes
                    </p>
                    </p>
                    <p>
                    <h2>Instrument File Format:</h2>
                    On Export, the generated table will contain the following 10 columns:

                    The first row will contain (case sensitive) column names in the following order (from left to right): “Vendor”, “Model-Number”, “Serial-Number”, “Asset-Tag-Number”,”Comment”, “Instrument-Categories” ,”Calibration-Date”,”Calibration-Comment”, “Calibration-File-Attachment”, ”Calibration-Load-Bank-Result-Exists”

                    On Import, only the following columns will be processed: “Vendor”, “Model-Number”, “Serial-Number”, “Asset-Tag-Number”,”Comment”,”Instrument-Categories” ,”Calibration-Date”,”Calibration-Comment”. Providing any additional columns will not result in an error, but the data in those columns will be ignored

                    Upon Instrument creation, if calibration date was specified, a new calibration event will be created with the calibration username field being equal to either the username of administrator who performed the import, or “admin” if the import was performed by system administrator
                    </p>
                    <p>
                    <h3>Vendor Column:</h3>
                    Max length of data within the Vendor column is 30 characters
                    The vendor field is required in every row
                    </p>
                    <p>
                    <h3>Model-Number Column:</h3>
                    Max length of data within the Model-Number column is 40 characters
                    The model number field is required in every row
                    </p>
                    <p>
                    <h3>Serial-Number Column:</h3>
                    Max length of data within the Serial-Number column is 40 characters
                    The Serial-Number field is optional
                    </p>
                    <p>
                    <h3>Asset-Tag-Number Column:</h3>
                    It is recommended for Asset-Tag-Number to be left empty, however, if the user doing the import desires to specify the asset tag numbers they may do so as long as the numbers adhere to the evolution requirements (6 digit number greater than 100,000).
                    The asset tag number must be unique, meaning that there cannot exist another instrument with matching asset tag number in the database
                    The number must be entered in a plain format (commas or periods must not be used to make numbers easier to read for human eye i.e 125,000 and 125.000 are not allowed and only 125000 is permitted)
                    </p>
                    <p>
                    <h3>Comment Column:</h3>
                    Max length of data within the Comment column is 2000 characters
                    Can be multiline
                    </p>
                    <p>
                    <h3>Calibration-Date Column</h3>
                    Max length of data within the Calibration-Date column is 20 characters
                    If the calibration-date field is left empty then
                    if model is not callibrable no error will be thrown
                    If the model is calibrable  the instrument will be flagged as requiring calibration..
                    Calibration-Date data must be a representation of date in excel short date format (MM/DD/YYYY)
                    If calibration-date field is not empty, but the model that the instrument refers to is non-callibrable, an an error message indicating this mistake will be thrown
                    </p>
                    <p>
                    <h3>Calibration-Comment Column:</h3>
                    Max length of data within the Calibration-Comment column is 2000 characters
                    Can be multiline
                    </p>
                    <p>
                    <h3>Instrument-Categories Column:</h3>
                    Contains space delimited list of categories the instrument belongs to. As per requirement 2.11 all categories are “whitespace free” meaning that they do not contain any spaces
                    Data within Categories column must be at most 100 characters
                    Data within categories column must match already existing categories
                    </p>
                    <p>
                    <h3>Calibration-File-Attachment Column:</h3>
                    This column is not needed and will be overlooked during import, but is added during export
                    If the last calibration for the instrument contains a file attachment, this column will contain information about that attachment
                    At the very least all groups will provide a message verifying that file attachment exists and what file format was attached i.e. “Attached PNG File”.
                    Some groups may choose to provide more information such as the exact url where the file can be downloaded
                    </p>
                    <p>
                    <h3>Calibration-Load-Bank-Result-Exists Column:</h3>
                    This column is not needed and will be overlooked during import, but is added during export
                    If the last calibration for the instrument was performed via Load Bank wizard, this column will indicate that this operation was performed.
                    The specific phrasing of this identification is up to individual implementations
                    </p>
                    <p>
                    <h3>Errors</h3>
                    If serial number is defined and model number-vendor-serial number combination is not unique, meaning there is a row in the table with the same Serial-Number, Model-Number and Vendor fields, or if there is a model document in the database with the same serial number, model number and vendor fields an error message indicating this mistake will be thrown
                    Vendor/Model-Number pair must already exist in database, if not an error message indicating this mistake will be thrown
                    If any of the fields described above do not match the listed specifications an error message indicating this mistake will be thrown
                    If calibration-date field is not empty, but the model that the instrument refers to is non-callibrable, an error message indicating this mistake will be thrown
                    </p>
                    <p>
                    <h2>Summary</h2>
                    <p>
                        Field Name: Vendor
                        Character Max: 30
                        Required: Yes
                    </p>
                    <p>
                        Field Name: Model-Number
                        Character Max: 40
                        Required: Yes
                    </p>
                    <p>
                        Field Name: Serial-Number
                        Character Max: 40
                        Required: No
                    </p>
                    <p>
                        Field Name: Asset-Tag-Number
                        Character Max: 40
                        Format Requirements: Number between 100000 and 999999, no commas or periods used for human readability  allowed
                        Required: No
                    </p>
                    <p>
                        Field Name: Comment
                        Character Max: 2000
                        Required: No
                    </p>
                    <p>
                        Field Name: Calibration-Date
                        Character Max: 20
                        Format Requirements: MM/DD/YYYY
                        Required: No
                    </p>
                    <p>
                        Field Name: Calibration-Comment
                        Character Max: 2000
                        Required: No
                    </p>
                    <p>
                        Field Name: Instrument-Categories
                        Character Max: 100
                        Format Requirements: Space separated category names
                        Required: No
                    </p>
                    <p>
                        Field Name: Calibration-File-Attachment
                        Character Max: N/A
                        Format Requirements: only provided on export, ignored on import
                        Required: No
                    </p>
                    <p>
                        Field Name: Calibration-Load-Bank-Result-Exists
                        Character Max: N/A
                        Format Requirements: only provided on export, ignored on import
                        Required: No
                    </p>
                    </p>
                    </body>
                </div>
            </MDBContainer>
        )

    }
}

export default ImportDocumentation