import {access, unlink} from 'node:fs/promises';

export const removeFile = async (filePath) => {
    try {
        await access(filePath);
    } catch (err) {
        throw err.code === 'ENOENT' ? new Error('FS operation failed: File does not exist.') : err;
    }

    await unlink(filePath);
    return 'successfully removed'
};