import {access, writeFile,} from 'node:fs/promises';
import {join} from 'node:path';

export const createFile = async (fileName) => {

    const filePath = join(process.cwd(), fileName).trim();

    try {
        await access(filePath);
        throw new Error('FS operation failed: File already exists.');
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
    }
    console.log(filePath)
    await writeFile(filePath, '')
    return 'created successfully'
};