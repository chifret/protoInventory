import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {Twodmap} from "../classes/twodmap.component";
import {InventoryService} from "../services/inventory.service";

@Component({
    selector: "itemsgrid-component",
    templateUrl: "./itemsgrid.component.html"
})
export class ItemsgridComponent implements OnInit {

    private map = new Twodmap<{ id: number, div: HTMLDivElement }>();
    private items: Map<number, { name: string, id: number, w: number, h: number, img: string, x: number, y: number, div: HTMLDivElement }> = new Map();
    private hover: HTMLDivElement[] = [];
    private dragItem: { name: string, id: number, w: number, h: number, img: string, x: number, y: number, div: HTMLDivElement } = null;

    @Input() x: number;
    @Input() y: number;
    private caseSize = 50;

    constructor(protected inventoryService: InventoryService) {
    }

    @ViewChild("container", {static: true}) container: ElementRef;
    @ViewChild("tilesContainer", {static: true}) tilesContainer: ElementRef;
    @ViewChild("itemsContainer", {static: true}) itemsContainer: ElementRef;

    ngOnInit() {

        (this.container.nativeElement as HTMLDivElement).style.height = this.y * this.caseSize + "px";
        (this.container.nativeElement as HTMLDivElement).style.width = this.x * this.caseSize + "px";

        // // ======================================= init =======================================
        for (let i = 1; i <= this.x; i++) {
            for (let j = 1; j <= this.y; j++) {
                this.map.set(i, j, {id: -1, div: null});
            }
        }

        this.inventoryService.getItems().forEach(item => {
            this.items.set(item.id, {...item, div: null});
            for (let i = item.x; i < item.x + item.w; i++) {
                for (let j = item.y; j < item.y + item.h; j++) {
                    this.map.set(i, j, {id: item.id, div: null});
                }
            }
        });

        // draw
        this.map.forEach((item, x, y) => {
            const div = document.createElement("div");
            div.style.fontSize = "6px";
            div.style.width = (this.caseSize - 2) + "px";
            div.style.height = (this.caseSize - 2) + "px";
            div.style.border = "1px solid black";
            div.style.position = "absolute";
            div.style.zIndex = "1";
            div.style.top = (y - 1) * this.caseSize + "px";
            div.style.left = (x - 1) * this.caseSize + "px";
            div.addEventListener("dragenter", () => {
                if (this.dragItem) {
                    this.dragenter(x, y);
                }
            });
            div.addEventListener("dragover", (e) => {
                if (this.dragItem) {
                    e.preventDefault();
                }
            });
            div.addEventListener("drop", () => {
                if (this.dragItem) {
                    this.drop(x, y);
                }
            });
            (this.tilesContainer.nativeElement as HTMLDivElement).appendChild(div);
            this.map.get(x, y).div = div;
        });

        this.items.forEach(item => {
            const div = document.createElement("div");
            div.style.background = "url(assets/img/" + item.img + ")";
            div.style.backgroundSize = this.caseSize * item.w + "px " + this.caseSize * item.h + "px";
            div.style.width = this.caseSize * item.w + "px";
            div.style.height = this.caseSize * item.h + "px";
            div.style.position = "absolute";
            div.style.zIndex = "2";
            div.style.top = (item.y - 1) * this.caseSize + "px";
            div.style.left = (item.x - 1) * this.caseSize + "px";
            div.draggable = true;
            div.addEventListener("dragstart", () => {
                this.dragstart(item);
            });
            div.addEventListener("dragend", () => {
                this.dragstop();
            });
            (this.itemsContainer.nativeElement as HTMLDivElement).appendChild(div);
            this.items.get(item.id).div = div;
        });
    }

    // ======================================= events =======================================

    dragenter(x: number, y: number): void {
        this.resetHover();

        const move = this.resolveItemMove({x, y});
        let color: string;

        if (move.ids.size === 0) {
            color = "greenyellow";
        } else if (move.ids.size > 1) {
            color = "lightcoral";
        } else {
            color = "khaki";
            // todo
        }

        this.hover.forEach(item => {
            item.style.backgroundColor = color;
        });
    }

    drop(x: number, y: number): void {
        const move = this.resolveItemMove({x, y});

        if (move.ids.size === 0) {
            for (let i = this.dragItem.x; i < this.dragItem.x + this.dragItem.w; i++) {
                for (let j = this.dragItem.y; j < this.dragItem.y + this.dragItem.h; j++) {
                    this.map.get(i, j).id = -1;
                }
            }
            for (let i = move.x; i < move.x + this.dragItem.w; i++) {
                for (let j = move.y; j < move.y + this.dragItem.h; j++) {
                    this.map.get(i, j).id = this.dragItem.id;
                }
            }
            this.dragItem.x = move.x;
            this.dragItem.y = move.y;
            this.dragItem.div.style.top = (this.dragItem.y - 1) * this.caseSize + "px";
            this.dragItem.div.style.left = (this.dragItem.x - 1) * this.caseSize + "px";

            console.log("call API");
        }
    }

    dragstart(item: { name: string, id: number, w: number, h: number, img: string, x: number, y: number, div: HTMLDivElement }): void {
        this.dragItem = item;
        setTimeout(() => {
            (this.itemsContainer.nativeElement as HTMLDivElement).style.pointerEvents = "none";
        }, 0);
    }

    dragstop(): void {
        this.dragItem = null;
        (this.itemsContainer.nativeElement as HTMLDivElement).style.pointerEvents = "";
    }

    mouseout(): any {
        this.resetHover();
    }

    // ======================================= methods =======================================

    private resetHover(): void {
        this.hover.forEach(item => {
            item.style.backgroundColor = "";
        });
        this.hover = [];
    }

    private resolveItemMove(pos: { x: number, y: number }): { x: number, y: number, ids: Map<number, boolean> } {
        let selX = pos.x;
        if (pos.x + this.dragItem.w > this.x) {
            selX = this.x - this.dragItem.w + 1;
        }
        let selY = pos.y;
        if (pos.y + this.dragItem.h > this.y) {
            selY = this.y - this.dragItem.h + 1;
        }

        const ids: Map<number, boolean> = new Map();
        for (let i = selX; i < selX + this.dragItem.w; i++) {
            for (let j = selY; j < selY + this.dragItem.h; j++) {
                const selItem = this.map.get(i, j);
                this.hover.push(selItem.div);
                if (selItem.id > -1 && selItem.id !== this.dragItem.id) {
                    ids.set(selItem.id, null);
                }
            }
        }
        return {x: selX, y: selY, ids};
    }
}
