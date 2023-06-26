import {startFileManager} from './basic/start.js'
import {getVarFromArgs} from "./helpers/getUsernameFromArgs.js";
import {list} from "./basic/list.js"
import os from "os";
import path from "path";
import {calculateHash} from "./hash/calcHash.js";
import {createFile} from "./basic/create.js";

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
    if (os.homedir().toString().length > targetDir.length) {
        console.log('\x1b[31m%s\x1b[0m', 'You can\'t go upper than root directory'); return;
    }
    if (targetFolder === '..') moveUp();
    else
    try {
        process.chdir(targetDir);
    } catch (err) {
        console.error(`Error changing directory: ${err}`);
    }
}

function hash(inputPath) {
    const targetFolder = inputPath.trim();
    const targetDir = path.resolve(targetFolder);
    console.log(targetDir)
        try {
            calculateHash(targetDir).then((data) => {
                console.log(data)}).catch(() => {
                console.log('\x1b[31m%s\x1b[0m', 'Unsuccessful. Check your file path')})
        } catch (err) {
            console.error(`Error during hashing: ${err}`);
        }
}

async function create(fileName) {
    try {
        // await createFile(fileName);
        await createFile(fileName).then((data) => {
            console.log(data)}).catch(() => {
            console.log('\x1b[31m%s\x1b[0m', 'create file unsuccessful. Check your file path')})
    } catch (err) {
        console.error(`Error during creating: ${err}`);
    }
}

process.stdin.on('data', (input) => {
    if (input.includes('.exit')) process.emit('SIGINT')
    else if (input.includes('up')) moveUp();
    else if (input.includes('ls')) list();
    else if (input.includes('cd ')) {cd(input.substring(3))}
    else if (input.includes('hash ')) {hash(input.substring(5))}
    else if (input.includes('add ')) {create(input.substring(4))}
    else console.log('\x1b[31m%s\x1b[0m', 'Invalid input')
});

process.on('SIGINT', onExit);

process.stdin.on('data', () => {
    console.log('\x1b[32m%s\x1b[0m', 'You are currently in ' + process.cwd())
});