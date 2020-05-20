import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {Twodmap} from "../classes/twodmap.component";
import {InventoryhandlerService} from "../services/inventoryhandler.service";

@Component({
    selector: "itemsgrid-component",
    templateUrl: "./inventory.component.html"
})
export class InventoryComponent implements OnInit {

    private readonly componentId: number = null;

    private map = new Twodmap<{ id: number, div: HTMLDivElement }>();
    private items: Map<number, { name: string, id: number, w: number, h: number, img: string, x: number, y: number, div: HTMLDivElement }> = new Map();
    private hover: HTMLDivElement[] = [];

    @Input() x: number;
    @Input() y: number;
    private caseSize = 50;

    @ViewChild("container", {static: true}) container: ElementRef<HTMLDivElement>;
    @ViewChild("tilesContainer", {static: true}) tilesContainer: ElementRef<HTMLDivElement>;
    @ViewChild("itemsContainer", {static: true}) itemsContainer: ElementRef<HTMLDivElement>;

    constructor(protected inventoryhandlerService: InventoryhandlerService) {
        this.componentId = this.inventoryhandlerService.register(this);
        this.inventoryhandlerService.dragStartEmitter.subscribe((value: { componentId: number }) => {
            this.dragstart();
        });
        this.inventoryhandlerService.dragStopEmitter.subscribe((value: { componentId: number }) => {
            this.dragstop();
        });
        this.inventoryhandlerService.dragEnterEmitter.subscribe((value: { componentId: number }) => {
            this.resetHover();
        });
        this.inventoryhandlerService.dropEmitter.subscribe((value: { componentId: number, fromX: number, fromY: number, toX: number, toY: number, collision: boolean }) => {
            this.drop(value.componentId, value.fromX, value.fromY, value.toX, value.toY, value.collision);
        });
    }

    ngOnInit() {
        this.container.nativeElement.style.height = (this.y * this.caseSize + 2) + "px";
        this.container.nativeElement.style.width = (this.x * this.caseSize + 2) + "px";

        // // ======================================= init =======================================
        for (let x = 1; x <= this.x; x++) {
            for (let y = 1; y <= this.y; y++) {
                const div = document.createElement("div");
                div.style.fontSize = "6px";
                div.style.boxSizing = "border-box";
                div.style.width = this.caseSize + "px";
                div.style.height = this.caseSize + "px";
                div.style.border = "1px solid black";
                div.style.position = "absolute";
                div.style.zIndex = "1";
                div.style.top = (y - 1) * this.caseSize + "px";
                div.style.left = (x - 1) * this.caseSize + "px";
                div.addEventListener("dragenter", () => {
                    if (this.inventoryhandlerService.dragItem) {
                        this.dragenter(x, y);
                    }
                });
                div.addEventListener("dragover", (e) => {
                    e.preventDefault();
                });
                div.addEventListener("drop", () => {
                    if (this.inventoryhandlerService.dragItem) {
                        const move = this.resolveItemMove({x, y});
                        if (move.collision < 1) {
                            this.inventoryhandlerService.drop(this.componentId, move.x, move.y, move.collision === 1);
                        }
                    }
                });
                this.tilesContainer.nativeElement.appendChild(div);
                this.map.set(x, y, {id: -1, div});
            }
        }
    }

    setItems(items: { name: string, id: number, w: number, h: number, img: string, x: number, y: number, div: HTMLDivElement }[]): void {
        items.forEach(item => {
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
                this.inventoryhandlerService.dragStart(this.componentId, item);
            });
            div.addEventListener("dragend", () => {
                this.inventoryhandlerService.dragStop(this.componentId);
            });
            this.itemsContainer.nativeElement.appendChild(div);
            item.div = div;

            this.items.set(item.id, item);
            for (let x = item.x; x < item.x + item.w; x++) {
                for (let y = item.y; y < item.y + item.h; y++) {
                    this.map.get(x, y).id = item.id;
                }
            }
        });
    }

    // ======================================= events =======================================

    dragenter(x: number, y: number): void {
        this.inventoryhandlerService.dragEnter(this.componentId);

        const move = this.resolveItemMove({x, y}, true);
        let color: string;

        if (move.collision === 0) {
            color = "greenyellow";
        } else if (move.collision > 1) {
            color = "lightcoral";
        } else {
            color = "khaki";
        }

        this.hover.forEach(item => {
            item.style.backgroundColor = color;
        });
    }

    drop(componentId: number, fromX: number, fromY: number, toX: number, toY: number, collision: boolean): void {

        const dragItem = this.inventoryhandlerService.dragItem;

        const from = this.items.has(dragItem.id);
        if (from) {
            for (let x = fromX; x < fromX + dragItem.w; x++) {
                for (let y = fromY; y < fromY + dragItem.h; y++) {
                    this.map.get(x, y).id = -1;
                }
            }
        }

        const to = componentId === this.componentId;
        if (to) {
            for (let x = toX; x < toX + dragItem.w; x++) {
                for (let y = toY; y < toY + dragItem.h; y++) {
                    this.map.get(x, y).id = dragItem.id;
                }
            }
        }

        if (to || from) {
            if (to && from) {
                this.setItemPosition(dragItem, toX, toY);
            } else if (from) {
                // remove
                this.items.delete(dragItem.id);
                console.log("moved");
            } else {
                this.items.set(dragItem.id, dragItem);
                this.itemsContainer.nativeElement.appendChild(dragItem.div);
                this.setItemPosition(dragItem, toX, toY);
            }
        }
    }

    // ok
    dragstart(): void {
        setTimeout(() => {
            this.itemsContainer.nativeElement.style.pointerEvents = "none";
        }, 0);
    }

    dragstop(): void {
        this.itemsContainer.nativeElement.style.pointerEvents = "";
    }

    mouseout(): void {
        this.resetHover();
    }

    // ======================================= methods =======================================

    private resetHover(): void {
        if (this.hover) {
            this.hover.forEach(item => {
                item.style.backgroundColor = "";
            });
            this.hover = null;
        }
    }

    private resolveItemMove(pos: { x: number, y: number }, generateHover = false): { x: number, y: number, collision: number } {
        const dragItem = this.inventoryhandlerService.dragItem;
        if (generateHover) {
            this.hover = [];
        }

        let selX = pos.x;
        if (pos.x + dragItem.w > this.x) {
            selX = this.x - dragItem.w + 1;
        }
        let selY = pos.y;
        if (pos.y + dragItem.h > this.y) {
            selY = this.y - dragItem.h + 1;
        }

        let collision = 0;
        const ids: Set<number> = new Set();
        for (let i = selX; i < selX + dragItem.w; i++) {
            for (let j = selY; j < selY + dragItem.h; j++) {
                const selItem = this.map.get(i, j);
                if (generateHover) {
                    this.hover.push(selItem.div);
                }
                if (selItem.id > -1) {
                    ids.add(selItem.id);
                }
            }
        }
        if (ids.size === 1) {
            ids.forEach(key => {
                if (key !== dragItem.id) {
                    collision = 1;
                }
            });
        } else if (ids.size > 1) {
            collision = 2;
        }

        return {x: selX, y: selY, collision};
    }

    private setItemPosition(item: { name: string, id: number, w: number, h: number, img: string, x: number, y: number, div: HTMLDivElement }, x: number, y: number): void {
        item.x = x;
        item.y = y;
        item.div.style.top = (item.y - 1) * this.caseSize + "px";
        item.div.style.left = (item.x - 1) * this.caseSize + "px";
    }
}
