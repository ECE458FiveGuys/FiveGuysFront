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