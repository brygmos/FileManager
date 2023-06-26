import {startFileManager} from './basic/start.js'
import {getVarFromArgs} from "./helpers/getUsernameFromArgs.js";
import {list} from "./basic/list.js"
import os from "os";
import path from "path";
import {calculateHash} from "./hash/calcHash.js";
import {createFile} from "./basic/create.js";
import {removeFile} from "./basic/delete.js";
import {osInfo} from "./basic/os.js";

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
        try {
            calculateHash(targetDir).then((data) => {
                console.log(data)}).catch(() => {
                console.log('\x1b[31m%s\x1b[0m', 'Unsuccessful. Check your file path')})
        } catch (err) {
            console.error(`Error during hashing: ${err}`);
        }
}

function remove(inputPath) {
    const targetFolder = inputPath.trim();
    const targetDir = path.resolve(targetFolder);
    try {
        removeFile(targetDir).then((data) => {
            console.log(data)}).catch(() => {
            console.log('\x1b[31m%s\x1b[0m', 'remove failure. Check your file path')})
    } catch (err) {
        console.error(`Error during removing: ${err}`);
    }
}

async function osInfoHandler(flag) {
    flag = flag.trim();
    try {
        await osInfo(flag).then((data) => {
            console.log(data)}).catch(() => {
            console.log('\x1b[31m%s\x1b[0m', 'info output failure. Check parameter')})
    } catch (err) {
        console.error(`Error during info print: ${err}`);
    }
}

async function create(fileName) {
    try {
        await createFile(fileName).then((data) => {
            console.log(data)}).catch(() => {
            console.log('\x1b[31m%s\x1b[0m', 'create file failure. Check your file path')})
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
    else if (input.includes('rm ')) {remove(input.substring(3))}
    else if (input.includes('os --')) {osInfoHandler(input.substring(5))}
    else console.log('\x1b[31m%s\x1b[0m', 'Invalid input')
});

process.on('SIGINT', onExit);

process.stdin.on('data', () => {
    console.log('\x1b[32m%s\x1b[0m', 'You are currently in ' + process.cwd())
});