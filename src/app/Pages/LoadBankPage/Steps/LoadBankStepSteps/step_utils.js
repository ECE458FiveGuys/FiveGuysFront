export const IdealCurrents = buildIdealCurrents()
export const CurrentStepNames = Object.keys(IdealCurrents)

function buildIdealCurrents() {
    let idealCurrents = {}
    idealCurrents["No load"] = 0
    let totalAmps = buildStepNamesForResistor(idealCurrents, 100, 10, 0)
    totalAmps = buildStepNamesForResistor(idealCurrents, 20, 5, totalAmps)
    buildStepNamesForResistor(idealCurrents, 1, 20, totalAmps)
    return idealCurrents
}

function buildStepNamesForResistor(idealCurrents, ampStepSize, numSteps, totalAmps) {
    let stepNames = Object.keys(idealCurrents)
    let stepNumber = stepNames.length
    let baseName = stepNames.length === 1 ? '' : stepNames[stepNames.length - 1] + ' + '
    for (let stepCount = 1 ; stepCount <= numSteps ; stepCount ++) {
        totalAmps += ampStepSize
        idealCurrents[`${baseName}${stepCount} x ${ampStepSize}A`] = totalAmps
        stepNumber += 1
    }
    return totalAmps
}

export function percentErrorGreaterThan (decimal, ideal, actual) {
    return Math.abs(((actual - ideal) / ideal)) > decimal
}

export function percentErrorGreaterThanOrEqualTo (decimal, ideal, actual) {
    return Math.abs(((actual - ideal) / ideal)) >= decimal
}
