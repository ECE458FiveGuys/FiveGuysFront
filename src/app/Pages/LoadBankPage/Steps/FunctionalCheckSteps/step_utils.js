export const FunctionCheckStepNames = {
    LOW_VOLTAGE_SHUTDOWN : "Low Volt Shutdown",
    LEAD_BUZZER : "Lead Buzzer",
    RECORDED_DATA : "Recorded Data",
    PRINTER_FUNCTIONAL : "Printer"
}

export const AllFunctionCheckStepNames = {
    ...FunctionCheckStepNames,
    ...{
        COMMENT : "Comment"
    }
}

export const FunctionCheckDescriptions = {
    [FunctionCheckStepNames.LOW_VOLTAGE_SHUTDOWN] : "Lower dc source voltage to check if the load bank automatically shuts down on low voltage",
    [FunctionCheckStepNames.LEAD_BUZZER] : "Lift the cell voltage lead to check if audible buzzer activates",
    [FunctionCheckStepNames.RECORDED_DATA] : "Verify the load bank's recorded data on computer",
    [FunctionCheckStepNames.PRINTER_FUNCTIONAL] : "Verify that your printer works!"
}