import * as alt from 'alt-server';

declare module 'alt-server' {
    export interface Player {
        wallet?: number;
        bank?: number;

        addToWallet(value: number): boolean;
        removeToWallet(value: number): boolean;
        addToBank(value: number): boolean;
        bankWithdraw(value: number): boolean;
    }
}

alt.Player.prototype.addToWallet = function addToWallet(value: number) {
    if (!this.wallet) this.wallet = value;
    else this.wallet += value;

    return true;
};

alt.Player.prototype.removeToWallet = function removeToWallet(value: number) {
    if (this.wallet < 0) this.wallet = 0;
    if (!this.wallet) this.wallet = value;
    else this.wallet -= value;

    return true;
};

alt.Player.prototype.addToBank = function addToBank(value: number) {
    if (!this.bank) this.bank = value;
    this.bank += value;
    this.wallet -= value;

    return true;
};

alt.Player.prototype.bankWithdraw = function bankWithdraw(value: number) {
    if (!this.bank) this.bank = value;
    if (this.bank - value < 0) return false;
    this.bank -= value;
    this.wallet += value;

    return true;
};
