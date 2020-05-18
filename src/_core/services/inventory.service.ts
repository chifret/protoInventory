import {Injectable} from "@angular/core";

@Injectable()
export class InventoryService {

    getItems(): { name: string, id: number, w: number, h: number, img: string, x: number, y: number }[] {
        return [
            {name: "Hachette", id: 23009, w: 2, h: 2, img: "hachette.png", x: 1, y: 1},
            {name: "Hallebarde", id: 108504, w: 3, h: 4, img: "hally.png", x: 3, y: 1},
            {name: "Pistolet mitrailleur", id: 424242, w: 2, h: 3, img: "pmittr.png", x: 6, y: 1}
        ];
    }
}
