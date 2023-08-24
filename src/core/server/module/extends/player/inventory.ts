import * as alt from 'alt-server';
import { Items, ItemsList } from '../../../../shared/items';

declare module 'alt-server' {
    export interface Player {
        inventory: [];
        addItem(item: string, amount?: number, slot?: number, info?: string | any): Promise<boolean>;
        removeItem(item: string, amount: number): Promise<boolean>;
    }
}

alt.Player.prototype.removeItem = async function removeItem(item: string, amount: number = 1): Promise<boolean> {
    const slot = getItemSlot(this.inventory, item);

    if (slot === undefined) {
        console.log('Item não encontrado no inventário.');
        return false;
    }

    const currentItem = this.inventory[slot];
    if (!currentItem || currentItem.amount < amount) {
        console.log('Quantidade especificada para remoção excede a quantidade disponível.');
        return false;
    }

    // Se a quantidade a ser removida é igual à quantidade no slot, remova o item completamente.
    if (currentItem.amount === amount) {
        delete this.inventory[slot];
    } else {
        currentItem.amount -= amount;
    }

    return true;
};

// Função para calcular o peso total do inventário
const calculateTotalWeight = (inventory: any[]): number => {
    return inventory.reduce((total, item) => total + (item ? item.weight * item.amount : 0), 0);
};

alt.Player.prototype.addItem = async function addItem(
    item: string,
    amount: number = 1,
    slot?: number,
    info?: string | any
) {
    const itemInfo = ItemsList[item.toLowerCase()];

    if (!itemInfo) {
        console.log('Item não existe');
        return false;
    }

    slot = slot ?? getItemSlot(this.inventory, item);

    if (itemInfo.type === 'weapon') {
        info = {
            serie: '99999', // Este é um placeholder. Revise conforme necessário.
        };
    }

    const totalWeight = calculateTotalWeight(this.inventory);

    if (totalWeight + itemInfo.weight * amount > 10000) {
        console.log('Inventário cheio');
        return false;
    }

    // Se o slot estiver definido e for um item não único
    if (slot !== undefined && !itemInfo.unique) {
        this.inventory[slot] = {
            ...this.inventory[slot],
            amount: this.inventory[slot].amount + amount,
        };
        return true;
    }

    // Se for um item único ou um novo item
    if (itemInfo.unique || slot === undefined) {
        for (let i = 0; i < 50; i++) {
            if (!this.inventory[i]) {
                this.inventory[i] = {
                    name: itemInfo.name,
                    amount: amount,
                    info: info || '',
                    label: itemInfo.label,
                    description: itemInfo.description || '',
                    weight: itemInfo.weight,
                    type: itemInfo.type,
                    unique: itemInfo.unique,
                    useable: itemInfo.useable,
                    image: itemInfo.image,
                    shouldClose: itemInfo.shouldClose,
                    slot: i,
                    combinable: itemInfo.combinable,
                };
                return true;
            }
        }
    }

    console.log('Erro ao adicionar item ao inventário.');
    return false;
};

const getItemSlot = (inventory: any[], item: string) => {
    if (!Array.isArray(inventory)) {
        console.error('O inventário não está definido como um array.');
        return undefined;
    }

    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i] && inventory[i].name.toLowerCase() === item.toLowerCase()) {
            return i;
        }
    }
    return undefined;
};
