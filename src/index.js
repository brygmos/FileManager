import {startFileManager} from './basic/start.js'
import {getVarFromArgs} from "./helpers/getUsernameFromArgs.js";
import {list} from "./helpers/list.js"
import os from "os";
import path from "path";

process.chdir(os.homedir());
process.stdin.setEncoding('utf8');

const argv = process.argv;
const usernameByConsole = getVarFromArgs(argv, '--username');

usernameByConsole == null ? startFileManager('anon') : startFileManager(usernameByConsole)

function onExit() {
    console.log(`Thank you for using File Manager, ${usernameByConsole}, goodbye!`);
    process.removeListener('SIGINT', onExit);
    process.removeListener('exit', onExit);
    process.exit();
}

function moveUp() {
    const parentDir = path.resolve(process.cwd(), '..');
    process.chdir(parentDir);
}

function cd(inputPath) {
    const targetFolder = inputPath.trim();
    const targetDir = path.resolve(process.cwd(), targetFolder);
    if (os.homedir().toString().length > targetDir.length) {console.info('You can\'t go upper than root directory'); return;}
    if (targetFolder === '..') moveUp();
    else
    try {
        process.chdir(targetDir);
    } catch (err) {
        console.error(`Error changing directory: ${err}`);
    }
}

process.stdin.on('data', (input) => {
    if (input.includes('.exit')) process.emit('SIGINT')
    if (input.includes('up')) moveUp();
    if (input.includes('ls')) list();
    if (input.includes('cd ')) {cd(input.substring(3))}
        else console.log('Invalid input')
});

process.on('SIGINT', onExit);

process.stdin.on('data', () => {
    console.log('You are currently in ' + process.cwd())
});