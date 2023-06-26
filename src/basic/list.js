import {access, readdir} from 'node:fs/promises';
import path from "path";

export const list = async () => {
    const filesDirPath = process.cwd()

    let fileNames = [];
    let folderNames = [];

    try {
        await access(filesDirPath);
    } catch (err) {
        throw err.code === 'ENOENT' ? new Error('FS operation failed: Directory does not exist.') : err;
    }

    let list = await readdir(filesDirPath, { withFileTypes: true }
    );

    for (let i = 0; i < list.length; i++) {
        if (list[i].isFile()) {
            fileNames.push(list[i].name);
        } else if (list[i].isDirectory()) {
            folderNames.push(list[i].name);
        }
    }

    console.log('========================================');
    console.log('                 Files:                 ');
    console.log('----------------------------------------');

    console.log('| Filename | Type |');
    console.log('----------------------------------------');

    for(let fileName of fileNames){
        let extension = path.extname(fileName);
        console.log(`| ${fileName} | File${extension ? ' (' + extension.substring(1).toUpperCase()+')' : ''} |`);
    }

    console.log('========================================');
    console.log('                Folders:                ');
    console.log('----------------------------------------');

    console.log('| Folder Name | Type |');
    console.log('========================================');


    for(let folderName of folderNames){
        console.log(`| ${folderName} | Directory |`);
    }
}

// await list();