import * as alt from 'alt-client';

alt.onServer('log:Console', handleLogConsole);

function handleLogConsole(msg: string) {
    alt.log(msg);
}

alt.setInterval(() => {
    alt.emitServer('savePlayer');
}, 6000);
