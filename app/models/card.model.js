class Card {
    constructor(card) {
        this.number = Math.trunc(card.number);
        this.email = '' + card.email;
        this.nick = '' + card.nick;
        this.firstName = '' + card.firstName;
        this.lastName = '' + card.lastName;
        this.picPath = '' + card.picPath;
        this.issueDate = new Date(card.issueDate);
        this.balance = Math.trunc(card.balance);
        this.isActive = !!card.isActive;
        this.pendingDeactivationDate = new Date(card.pendingDeactivationDate);
    }
}

module.exports = Card;
