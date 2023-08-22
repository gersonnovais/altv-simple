import * as alt from 'alt-server';
import Database from './db.js';

alt.log(`alt:V Server - Boilerplate Started`);
alt.on('playerConnect', handlePlayerConnect);

async function handlePlayerConnect(player: alt.Player) {
    const user: any = await Database.fetchData('socialID', player.socialID, 'Account');

    if (!user) {
        return await newUser(player);
    }

    await spawnPlayer(player, user);

    alt.emitClient(player, 'log:Console', 'alt:V Server - Boilerplate Started');
}

const newUser = async (player: alt.Player) => {
    const playerData = {
        wallet: 0,
        bank: 0,
        socialID: player.socialID,
        hwidExHash: player.hwidExHash,
        hwidHash: player.hwidHash,
        bankAccount:
            'US0' +
            Math.floor(Math.random() * 10) +
            'xR' +
            Math.floor(Math.random() * 1000) +
            Math.floor(Math.random() * 10),

        inv: [],
        pos: new alt.Vector3(36.19486618041992, 859.3850708007812, 197.71343994140625),
        model: 'mp_m_freemode_01',
    };
    const saveData = await Database.insertData(playerData, 'Account');
    const user: any = await Database.fetchData('socialID', player.socialID, 'Account');
    await spawnPlayer(player, user);

    alt.emitClient(player, 'log:Console', 'alt:V Server - Boilerplate Started');
};
const spawnPlayer = async (player: alt.Player, data: any) => {
    player.setSyncedMeta('playerData', data);
    player.model = data.model;
    player.spawn(data.pos);
    player.wallet = data.wallet;
    player._id = await data._id.toString();
    player.bank = data.bank;
    alt.emitClient(player, 'financial', data.wallet, data.bank);
};
