export function startFileManager(user) {
    console.log(`Welcome to the File Manager, ${user}!`)
    console.info('You are currently in', process.cwd());
    process.on("close", () => `Thank you for using File Manager, ${user}, goodbye!`);
}