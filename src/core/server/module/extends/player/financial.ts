import * as alt from 'alt-server';

declare module 'alt-server' {
    export interface Player {
        wallet?: number;
        bank?: number;

        addToWallet(value: number): boolean;
        removeToWallet(value: number): boolean;
        bankDeposit(value: number): boolean;
        bankWithdraw(value: number): boolean;
        removeToBank(value: number): boolean;
    }
}

alt.Player.prototype.addToWallet = function addToWallet(value: number) {
    if (value < 0) return false;
    if (!this.wallet) this.wallet = 0;
    this.wallet += value;
    return true;
};

alt.Player.prototype.removeToWallet = function removeToWallet(value: number) {
    if (value < 0 || !this.wallet || this.wallet - value < 0) return false;
    this.wallet -= value;
    return true;
};

alt.Player.prototype.bankDeposit = function bankDeposit(value: number) {
    if (value < 0 || !this.wallet || this.wallet - value < 0) return false;
    if (!this.bank) this.bank = 0;
    this.bank += value;
    this.wallet -= value;
    return true;
};

alt.Player.prototype.bankWithdraw = function bankWithdraw(value: number) {
    if (value < 0 || !this.bank || this.bank - value < 0) return false;
    this.bank -= value;
    this.wallet += value;
    return true;
};

alt.Player.prototype.removeToBank = function removeToBank(value: number) {
    if (value < 0 || !this.wallet || this.wallet < value) return false;
    if (!this.bank) this.bank = 0;
    this.bank += value;
    return true;
};
