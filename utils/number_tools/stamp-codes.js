class StampCodes {
    getStampCode() {
        const codeLength = 10;
        const allowedChars = 'abcdefghijklmnopqrstuvwxyz';
        const cryptoRandomString = require('crypto-random-string');
        
        const stampCode = cryptoRandomString({
            length: codeLength,
            characters: allowedChars
        })

        return stampCode;
    }
}

module.exports = StampCodes;
