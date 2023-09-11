module.exports = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // generate a random number between 0 and 16
        const r = Math.random() * 16 | 0;
        // if c is x, return r, else return r AND 0x3 OR 0x8
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    })
}
