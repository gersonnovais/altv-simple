import * as alt from 'alt-client';

declare module 'alt-client' {
    export interface Player {
        wallet?: number;
        bank?: number;
        webViewOpen: boolean;
    }
}
