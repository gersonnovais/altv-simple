import * as alt from 'alt-server';
import Database from './db';

alt.log(`alt:V Server - Boilerplate Started`);
alt.on('playerConnect', handlePlayerConnect);

async function handlePlayerConnect(player: alt.Player) {
    const user: any = await Database.fetchData('uuid', player.socialID, 'Account');

    if (!user) {
        const playerData = {
            wallet: 0,
            bank: 0,
            uuid: player.socialID,
            inv: [],
            pos: new alt.Vector3(36.19486618041992, 859.3850708007812, 197.71343994140625),
            model: 'mp_m_freemode_01',
        };
        const saveData = await Database.insertData(playerData, 'Account');
        if (!saveData) throw new Error('deu ruim salvou nao');
        await spawnPlayer(player, saveData);
    }

    player.setMeta('id', user._id.toString());

    await spawnPlayer(player, user);

    alt.emitClient(player, 'log:Console', 'alt:V Server - Boilerplate Started');
}

const spawnPlayer = async (player: alt.Player, data: any) => {
    player.setSyncedMeta('playerData', data);
    player.model = data.model;
    player.spawn(data.pos);
};

alt.onClient('savePlayer', async (player: alt.Player) => {
    try {
        await Database.updatePartialData(player.getMeta('id'), { pos: player.pos }, 'Account');
    } catch (error) {
        throw new Error('deu ruim');
    }
});
