import * as alt from 'alt-server';

alt.onClient('paycheck', (player: alt.Player) => {
    player.addToWallet(20);
    alt.emitClient(player, 'financial', player.wallet, player.bank);
    alt.emitClient(player, 'drawNotification', 'CHAR_AMMUNATION', 'CAIXATEM', 'bolsa familia', 'voce recebeu R$: 20.');
});

alt.onClient('savePlayer', async (player: alt.Player) => {
    try {
        await player.saveAll();
    } catch (error) {
        throw new Error('deu ruim');
    }
});
