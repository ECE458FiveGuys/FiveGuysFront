export const CurrentStepNames = {
    NO_LOAD : "No load",
    STEP_1_1 : "1 x 100A",
    STEP_1_2 : "2 x 100A"
}

export const IdealCurrents = {
    [CurrentStepNames.NO_LOAD] : 0,
    [CurrentStepNames.STEP_1_1] : 100,
    [CurrentStepNames.STEP_1_2] : 200
}

export function percentErrorGreaterThan (decimal, ideal, actual) {
    return Math.abs(((actual - ideal) / ideal)) > decimal
}
