import {DC_STEP_NAMES} from "./Steps/StepEnums/dc_step_enums";
import {AC_STEP_NAMES} from "./Steps/StepEnums/ac_step_enums";

export const StepNames = {
    VISUAL_CHECK_STEP : "Visual Check",
    DC_STEP : "DC Calibration",
    AC_STEP : "AC Calibration",
    COMMENT : "Final Comments"
}

export const StepNameList = Object.values(StepNames)

export const VoltageTestInputVoltages = {
    VDC_3pt5 : 3.5,
    VAC_3pt513_50HZ : 3.513,
    VAC_100_20kHz : 100,
    VAC_3pt5_10kHz : 3.5,
    VAC_35_10kHz : 35,
}

export const VoltageTestInputFrequencies = {
    VDC_3pt5 : undefined,
    VAC_3pt513_50HZ : "50 Hz",
    VAC_100_20kHz : "20 kHz",
    VAC_3pt5_10kHz : "10 kHz",
    VAC_35_10kHz : "10 kHz",
}

export const VoltageTestExpectedReadings = {
    VDC_3pt5 : 3.5,
    VAC_3pt513_50HZ : 3.5,
    VAC_100_20kHz : 100,
    VAC_3pt5_10kHz : 3.5,
    VAC_35_10kHz : 35,
}

export const VoltageTestErrorMargins = {
    VDC_3pt5 : .001,
    VAC_3pt513_50HZ : .002,
    VAC_100_20kHz : .2,
    VAC_3pt5_10kHz : .004,
    VAC_35_10kHz : .04
}

export const VoltageTestErrorMessages = {
    VDC_3pt5 : buildErrorMessage("VDC_3pt5", "R21"),
    VAC_3pt513_50HZ : buildErrorMessage("VAC_3pt513_50HZ", "R34"),
    VAC_100_20kHz : buildErrorMessage("VAC_100_20kHz", "C37"),
    VAC_3pt5_10kHz : buildErrorMessage("VAC_3pt5_10kHz", "C2"),
    VAC_35_10kHz : buildErrorMessage("VAC_35_10kHz", "C3")
}

export const TestVoltageStepKeys = Object.keys(VoltageTestExpectedReadings)

export const VoltageTestStepNamesToKeys = {
    [DC_STEP_NAMES.TEST_VOLTAGE] : TestVoltageStepKeys[0],
    [AC_STEP_NAMES.TEST_STEP_1] : TestVoltageStepKeys[1],
    [AC_STEP_NAMES.TEST_STEP_2] : TestVoltageStepKeys[2],
    [AC_STEP_NAMES.TEST_STEP_3] : TestVoltageStepKeys[3],
    [AC_STEP_NAMES.TEST_STEP_4] : TestVoltageStepKeys[4],
}

function buildErrorMessage(stepName, resistor) {
    return `Reading differs from expected by more than ${VoltageTestErrorMargins[stepName]}. Adjust ${resistor} to obtain proper display.`
}