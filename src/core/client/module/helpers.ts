import * as alt from 'alt-client';
import native from 'natives';

const drawText2d = (
    msg: any,
    x: number,
    y: number,
    scale: number,
    fontType: number,
    r: number,
    g: number,
    b: number,
    a: number,
    useOutline = true,
    useDropShadow = true,
    align = 0
) => {
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(r, g, b, a);
    native.setTextJustification(align);

    if (useOutline) {
        native.setTextOutline();
    }

    if (useDropShadow) {
        native.setTextDropShadow();
    }

    native.endTextCommandDisplayText(x, y, 0);
};
const drawText3d = (
    msg: string,
    x: number,
    y: number,
    z: number,
    scale: number,
    fontType: number,
    r: number,
    g: number,
    b: number,
    a: number,
    useOutline = true,
    useDropShadow = true
) => {
    native.setDrawOrigin(x, y, z, false);
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(r, g, b, a);

    if (useOutline) {
        native.setTextOutline();
    }

    if (useDropShadow) {
        native.setTextDropShadow();
    }

    native.endTextCommandDisplayText(0, 0, 0);
    native.clearDrawOrigin();
};

const drawNotification = (imageName: string, headerMsg: string, detailsMsg: string, message: string) => {
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringPlayerName(message);
    native.endTextCommandThefeedPostMessagetextTu(
        imageName.toUpperCase(),
        imageName.toUpperCase(),
        false,
        4,
        headerMsg,
        detailsMsg,
        1.0
    );
    native.endTextCommandThefeedPostTicker(false, false);
};

export default { drawText2d, drawText3d, drawNotification };
