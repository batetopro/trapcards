class CardsController {
    constructor(data, cardNumbers, mailTransport) {
        this.data = data;
        this.cardNumbers = cardNumbers;
        this.mailTransport = mailTransport;
    }

    async cardCheck(req, res) {
        let card = undefined;
        if (req.query.cardnumber) {
            card = await this.data.cards.getByNumber(req.query.cardnumber);
            if (!card) {
                req.flash('error', `Карта с номер ${req.query.cardnumber} не съществува.`);
            }
        }
        res.render('public/card-check', { title: 'Проверка на карта', searchedCardNumber: req.query.cardnumber, card: card, errors:  await req.consumeFlash('error') });
    }

    async redeemStamp(req, res) {
        let cardNumber = req.query.cardnumber;
        let stampCode = req.query.stampcode;
        if (cardNumber && stampCode) {
            const delayAction = async (milliseconds) => {
                return new Promise((resolve) => {
                    setTimeout(() => resolve(), milliseconds);
                });                
            }
            await delayAction(5000); // delay response for 5 seconds to avoid brute forcing the codes

            let hasError = false;

            const stamp = await this.data.stamps.getByCode(stampCode);
            if (stamp) {
                if (stamp.claimedByNumber) {
                    hasError = true;
                }
            } else {
                hasError = true;
            }
            let card = await this.data.cards.getByNumber(cardNumber);
            if (!card) {
                hasError = true;
            }

            if (card && stamp) {
                const isSuccessful = await this.data.stamps.redeemStamp(stamp.code, card.number);
                if (!isSuccessful) {
                    hasError = true;
                }
            }

            if (hasError) {
                req.flash('error', 'Кодът на талона е грешен, номерът на картата е грешен или талонът е вече използван!');
            } else {
                req.flash('info', `Талон с код ${stamp.code} е въведен в карта номер ${card.number}.`);
                stampCode = null;

                // activate card
                const isCardActivated = await this.data.cards.activateCardIfEnoughPoints(card.number, 100);
                if (isCardActivated) {
                    // get the card again to get its correct point number
                    card = await this.data.cards.getByNumber(cardNumber);
                    req.flash('info', `Карта номер ${card.number} вече е активна!`);
                    try {
                        // send mail here
                        let mailOptions = {
                            from: '"Trotoara cards" <cards@cards.trotoara.com>',
                            to: card.email,
                            subject: `Активирана карта ${card.number}`,
                            template: 'activated',
                            context: {
                                card: card
                            }
                        };
                        await this.mailTransport.sendMail(mailOptions);
                        console.log('Mail sent.');
                    } catch (err) {
                        console.log('Mail not sent! ' + err)
                    }
                }
            }
        }

        res.render('public/redeem-stamp', { 
            title: 'Въвеждане на талон', 
            cardNumber, 
            stampCode,
            messages: await req.consumeFlash('info'), 
            errors: await req.consumeFlash('error') 
        });    
    }

    async register(req, res) {
        if (req.method == 'POST') {
            let hasErrors = false;
            let newCard = {};

            if (!req.body.email) {
                hasErrors = true;
                req.flash('error', 'Не е въведен e-mail!');
            }

            const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

            if (!emailRegexp.test(req.body.email)) {
                hasErrors = true;
                req.flash('error', 'Въведеният e-mail не е валиден!');
            }

            if (req.body.email != req.body.emailconfirm) {
                hasErrors = true;
                req.flash('error', 'Въведеният e-mail не съвада с потвърдения e-mail!');
            }

            if (!req.body.firstname) {
                hasErrors = true;
                req.flash('error', 'Не е въведено собствено име!');
            }

            if (!req.body.lastname) {
                hasErrors = true;
                req.flash('error', 'Не е въведено фамилно име!');
            }

            if (!hasErrors) {
                const cardFields = {
                    email: req.body.email,
                    nick: req.body.nick,
                    firstName: req.body.firstname,
                    lastName: req.body.lastname,
                    picPath: '',
                }
                try {
                    newCard = await this.data.cards.addCard(cardFields, (cn) => this.cardNumbers.putChecksum(cn));
                    req.flash('info', `Успешна регистрация. Номерът на регистрираната карта е ${newCard.number}.`);
                    res.redirect(303, `/redeem-stamp?cardnumber=${newCard.number}`);
                } catch (err) {
                    req.flash('error', 'Възникна грешка при регистрацията!');
                    hasErrors = true;
                }
            }

            if (!hasErrors) {
                try {
                    // send mail here
                    let mailOptions = {
                        from: '"Trotoara cards" <cards@cards.trotoara.com>',
                        to: newCard.email,
                        subject: `Създадена карта ${newCard.number}`,
                        template: 'registered',
                        context: {
                            cardNumber: newCard.number,
                            email: newCard.email,
                            nick: newCard.nick,
                            firstName: newCard.firstName,
                            lastName: newCard.lastName
                        }
                    };
                    await this.mailTransport.sendMail(mailOptions);
                    console.log('Mail sent.');
                } catch (err) {
                    // too late for error after response
                    console.log('Mail not sent! ' + err)
                }
            }

            if (!hasErrors) {
                return;
            }
        }
        
        const templateValues = {
            title: 'Регистрация',
            email: req.body.email,
            nick: req.body.nick,
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            messages: await req.consumeFlash('info'), 
            errors: await req.consumeFlash('error') 
        }
        res.render('public/register', templateValues);    
    }
}

module.exports = CardsController;
