function chunk(buf, chunkSize = 512) {
    let x = 0;
    let y = chunkSize;

    const size = buf.byteLength;
    const result = [];

    for (let i = 0; i < size / chunkSize; i++) {
        result.push(buf.slice(x, y));

        x = y;
        y = x + chunkSize;
    }

    return result;
}

module.exports = {
    chunk
};
