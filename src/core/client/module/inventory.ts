import Browser from './browser';
import * as alt from 'alt-client';
const INVENTORY_KEY = 73; // "I" key
const ESC_KEY = 27; // "Esc" key
let isOpen = false;
let hud: alt.WebView;
const openInventory = (data: any) => {
    hud = new alt.WebView('http://resource/client/html/inventory/ui.html');
    hud.on('inventory:useItem', (item) => {
        alt.emitServer('inventory:useItem', item.name);
    });
    hud.on('inventory:Notify', (msg, type) => {
        alt.log('notify', msg, type);
    });
    hud.on('inventory:dropItem', (inventory, item, amount) => {
        alt.log('drop');
        alt.emitServer('inventory:dropItem', item.name, amount);
    });
    hud.on('inventory:close', () => {
        // Browser.close();
        closeInventory();
    });
    hud.on('load', () => {
        hud.emit('inventory:open', data);
    });
    alt.toggleGameControls(false);
    isOpen = true;
    hud.focus();
    alt.toggleGameControls(false);
    alt.showCursor(true);
};

const closeInventory = () => {
    hud.destroy();
    isOpen = false;
    alt.Player.local.webViewOpen = false;

    alt.toggleGameControls(true);
    alt.showCursor(false);
};

const updateInventory = (iData, isError) => {
    const data = {
        inventory: iData,
        slots: 20,
        maxWeight: 50,
        error: isError,
    };
    hud.emit('inventory:update', alt.Player.local.getSyncedMeta('inventory'));
};

alt.on('keydown', (key) => {
    if (
        key === INVENTORY_KEY &&
        !isOpen &&
        !alt.Player.local.webViewOpen &&
        !alt.Player.local.isDead &&
        !alt.isMenuOpen()
    ) {
        isOpen = true;
        alt.Player.local.webViewOpen = true;
        let items = alt.Player.local.getSyncedMeta('inventory');
        const data = {
            inventory: items,
            slots: 20,
            other: null,
            maxWeight: 50,
            ammo: {},
            maxAmmo: 100,
        };
        // console.log(items);
        openInventory(data);
        alt.setTimeout(() => {
            hud.emit('inventory:update', data);
        }, 500);
    }
    if (key === ESC_KEY && isOpen && !alt.isMenuOpen()) {
        closeInventory();
    }
});
