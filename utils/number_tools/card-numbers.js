class CardNumbers {
    isCardNumValid(cardNum) {
        const cardNumWithCalcedChecksum = this.putChecksum(cardNum);
        return cardNumWithCalcedChecksum === cardNum;
    }

    // Last two digits are the checksum
    putChecksum(cardNum) {
        // The algorithm is plagiated from the IBAN algorithm
        const cardNumWithoutChecksum = Math.trunc(cardNum / 100);
        const checksum = 98 - cardNumWithoutChecksum % 97;
        const cardNumWithChecksum = cardNumWithoutChecksum * 100 + checksum;
        return cardNumWithChecksum;
    }
}

module.exports = CardNumbers;
