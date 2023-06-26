export function getVarFromArgs(argArr, varName) {
    const argList = argArr;
    let variable;

    for (let i = 0; i < argList.length; i++) {
        if (argList[i].startsWith(varName)) {
            variable = argList[i].substring(varName.length + 1);
            break;
        }
    }

    return variable || null;
}