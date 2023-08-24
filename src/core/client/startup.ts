import * as alt from 'alt-client';
import helpers from './module/helpers.js';
import './module/inventory.js';
alt.onServer('log:Console', handleLogConsole);

function handleLogConsole(msg: string) {
    alt.log(msg);
}

alt.setInterval(() => {
    alt.emitServer('savePlayer');
}, 6000);

alt.setInterval(() => {
    alt.emitServer('paycheck');
}, 24000);

alt.onServer('financial', (wallet, bank) => {
    alt.Player.local.wallet = wallet;
    alt.Player.local.bank = bank;
});
alt.on('connectionComplete', () => {
    alt.Player.local.webViewOpen = false;
});
// alt.onServer('drawNotification', helpers.drawNotification);

alt.setInterval(() => {
    helpers.drawText2d(`Wallet: ${alt.Player.local.wallet?.toString()}`, 0.9, 0.05, 0.4, 4, 255, 255, 255, 255);
    helpers.drawText2d(`bank: ${alt.Player.local.bank?.toString()}`, 0.9, 0.07, 0.4, 4, 255, 255, 255, 255);
    const playerPos = { ...alt.Player.local.pos };
    helpers.drawText3d(
        alt.Discord.currentUser.name || alt.Player.local.name,
        playerPos.x,
        playerPos.y,
        playerPos.z + 1,
        0.3,
        4,
        255,
        255,
        255,
        255
    );
}, 0);
