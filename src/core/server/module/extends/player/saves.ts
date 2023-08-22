import * as alt from 'alt-server';
import Database from '../../db.js';

declare module 'alt-server' {
    export interface Player {
        savePos(): Promise<boolean>;
        saveWallet(): Promise<boolean>;
        saveBank(): Promise<boolean>;
        saveAll(): Promise<boolean>;
    }
}

alt.Player.prototype.savePos = async function savePos() {
    await Database.updatePartialData(this._id, { pos: this.pos }, 'Account');
    return true;
};

alt.Player.prototype.saveWallet = async function saveWallet() {
    await Database.updatePartialData(this._id, { wallet: this.wallet }, 'Account');
    return true;
};

alt.Player.prototype.saveBank = async function saveBank() {
    await Database.updatePartialData(this._id, { bank: this.bank }, 'Account');
    return true;
};

alt.Player.prototype.saveAll = async function saveAll() {
    await Promise.all([this.saveBank(), this.saveWallet(), this.savePos()]);
    return true;
};
