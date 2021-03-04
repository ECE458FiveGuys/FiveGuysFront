import React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

export default function DatePickers() {
    const today = new Date();
    return <DayPicker
        formatDate={'YYYY-MM-DD'}
        disabledDays={{ after: today }}
        selectedDays={new Date()}
    />;
}


// import React, { useState } from "react";
// import DatePicker from "react-datepicker";
//
// import "react-datepicker/dist/react-datepicker.css";
//
// // CSS Modules, react-datepicker-cssmodules.css
// // import 'react-datepicker/dist/react-datepicker-cssmodules.css';
//
// // function getDate = () => {
// //     const [startDate, setStartDate] = useState(new Date());
// //     return (
// //         <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
// //     );
// // };
//
// export default function DatePickers() {
//     // return ({getDate});
//     const [startDate, setStartDate] = useState(new Date());
//     return (
//         <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
//     );
// }





// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
//
// const useStyles = makeStyles((theme) => ({
//     container: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     textField: {
//         marginLeft: theme.spacing(1),
//         marginRight: theme.spacing(1),
//         width: 200,
//     },
// }));
//
//
// export default function DatePickers() {
//     const classes = useStyles();
//
//     var today = new Date()
//     var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
//
//     return (
//         <form className={classes.container} noValidate>
//             <TextField
//                 id="date"
//                 label="Birthday"
//                 type="date"
//                 defaultValue={date}
//                 className={classes.textField}
//                 InputLabelProps={{
//                     shrink: true,
//                 }}
//             />
//         </form>
//     );
// }