import Database from '@stuyk/ezmongodb';

const [url, db, collections] = ['mongodb://localhost:27017', 'core', ['Account']];

const connect = async () => {
    const connected = await Database.init(url, db, collections);
    if (!connected) throw new Error('deu ruim na db');
};
connect();
export default Database;
