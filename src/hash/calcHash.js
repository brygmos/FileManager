import {readFile} from 'node:fs/promises';
import {createHash} from 'crypto';

export const calculateHash = async (filePath) => {
    const fileData = readFile(filePath);

    return createHash('sha256').update(await fileData).digest('hex')
};