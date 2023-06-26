import os from 'os';

export const osInfo = async (flag) => {
    let ans;
    switch (flag) {
        case 'EOL': {
            const eol = os.EOL;
            ans = `The End-Of-Line sequence for this OS is: '${JSON.stringify(eol)}'`; break;
        }
        case 'cpus': {
                const cpus = os.cpus();
                ans = `This machine has ${cpus.length} CPU(s):\n`;

                for (let i = 0; i < cpus.length; i++) {
                    const cpuModel = cpus[i].model;
                    const cpuSpeedGHz = (cpus[i].speed / 1000).toFixed(2);
                    ans = ans + `CPU ${i + 1}: ${cpuModel} @ ${cpuSpeedGHz} GHz\n`;
                }
                break;
        }
        case 'homedir': ans = os.homedir(); break;
        case 'username': ans = os.userInfo().username; break;
        case 'architecture': ans = os.arch(); break;
        default: ans = 'no info'; break;
    }
    return ans === '' ? '[empty]' : ans
};