import {Injectable} from "@angular/core";

@Injectable()
export class InventoryService {

    getItems(): { name: string, id: number, w: number, h: number, img: string, x: number, y: number, div: HTMLDivElement }[] {
        return [
            {name: "Hachette", id: 23009, w: 2, h: 2, img: "hachette.png", x: 1, y: 1, div: null},
            {name: "Hallebarde", id: 108504, w: 3, h: 4, img: "hally.png", x: 3, y: 1, div: null},
            {name: "Pistolet mitrailleur", id: 424242, w: 2, h: 3, img: "pmittr.png", x: 6, y: 1, div: null}
        ];
    }

    getItems2(): { name: string, id: number, w: number, h: number, img: string, x: number, y: number, div: HTMLDivElement }[] {
        return [
            {name: "Hachette", id: 230092, w: 2, h: 2, img: "hachette.png", x: 5, y: 3, div: null},
            {name: "Pistolet mitrailleur", id: 4242422, w: 2, h: 3, img: "pmittr.png", x: 2, y: 2, div: null}
        ];
    }
}
