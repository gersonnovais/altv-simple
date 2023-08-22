import * as alt from 'alt-server';

declare module 'alt-server' {
    export interface Player {
        _id: string;
        emitMeta(key: string, ...args: any[]): void;
        emitSyncedMeta(key: string, ...args: any[]): void;
        emitStreamSyncedMeta(key: string, ...args: any[]): void;
    }
}

// Funções de emissão de meta dados
alt.Player.prototype.emitMeta = function emitMeta(key: string, ...args: any[]) {
    this.setMeta(key, ...args);
    alt.emitClient(this, key, ...args);
};

alt.Player.prototype.emitSyncedMeta = function emitSyncedMeta(key: string, ...args: any[]) {
    this.setSyncedMeta(key, ...args);
    alt.emitClient(this, key, ...args);
};

alt.Player.prototype.emitStreamSyncedMeta = function emitStreamSyncedMeta(key: string, ...args: any[]) {
    this.setStreamSyncedMeta(key, ...args);
    alt.emitClient(this, key, ...args);
};
