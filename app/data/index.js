const CardsData = require('./cards.data');
const StampsData = require('./stamps.data');
const AdminsData = require('./admins.data');

const init = async (database) => {
    return {
        cards: new CardsData(database),
        stamps: new StampsData(database),
        admins: new AdminsData(database)
    };
};

module.exports = { init };