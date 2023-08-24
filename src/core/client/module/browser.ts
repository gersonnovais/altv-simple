import * as native from 'natives';
import * as alt from 'alt-client';

const blankURL: string = 'http://resource/client/html/blank.html';

interface Event {
    eventName: string;
    callback: (...args: any[]) => void;
}

let instance: alt.WebView | null = null;
let currentEvents: Event[] = [];
let cursorCount: number = 0;
let isClosing: boolean = false;

// Start a new browser instance
const createInstance = (): void => {
    if (instance) return;
    instance = new alt.WebView(blankURL);
};

// Show cursor
const showCursor = (state: boolean): void => {
    cursorCount = state ? cursorCount + 1 : 0;
    alt.showCursor(state);
};

// Allows another resource to open a new url
const open = async (
    url: string,
    cursor: boolean = true,
    blurBackground?: boolean,
    isOverlay: boolean = false
): Promise<void> => {
    if (!instance) createInstance();

    if (isClosing) {
        await new Promise<void>((resolve) => {
            const tmpInterval = alt.setInterval(() => {
                if (!isClosing) {
                    alt.clearInterval(tmpInterval);
                    resolve();
                }
            }, 5);
        });
    }

    if (currentEvents.length > 0) close(0);

    if (blurBackground) {
        native.triggerScreenblurFadeIn(100);
        native.displayRadar(false);
    }

    alt.Player.local.webViewOpen = true;
    instance.url = url;
    showCursor(cursor);
    instance.focus();

    instance.on('load', () => {
        instance!.isVisible = true;
    });

    alt.log(`PICKED URL: ${url}`);
};

// Register a new event
const on = (eventName: string, listener: (...args: any[]) => void): void => {
    if (!instance || currentEvents.some((e) => e.eventName === eventName)) return;
    currentEvents.push({ eventName, callback: listener });
    instance.on(eventName, listener);
};

// Emit an event to browser
const emit = (eventName: string, ...args: any[]): void => {
    instance?.emit(eventName, ...args);
};

// Return webview to blank and turn off all events
const close = (delay: number = 0): void => {
    if (!instance) return;

    instance.isVisible = false;
    alt.log('closing');
    isClosing = true;
    instance.url = blankURL;
    showCursor(false);
    instance.unfocus();

    alt.Player.local.webViewOpen = false;
    native.triggerScreenblurFadeOut(100);
    native.displayRadar(true);

    currentEvents.forEach((eventData) => instance!.off(eventData.eventName, eventData.callback));
    currentEvents = [];

    alt.setTimeout(() => {
        isClosing = false;
    }, delay);
};

// Destroy current browser instance
const destroyInstance = (): void => {
    instance?.destroy();
    instance = null;
};

const getCurrentViewState = (): boolean => {
    return alt.Player.local.webViewOpen;
};

export default {
    createInstance,
    showCursor,
    open,
    on,
    emit,
    close,
    destroyInstance,
    getCurrentViewState,
};
