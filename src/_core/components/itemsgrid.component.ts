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

    @Input() x: number;
    @Input() y: number;
    private caseSize = 50;

    constructor(protected inventoryService: InventoryService) {
    }

    @ViewChild("container", {static: true}) container: ElementRef;

    ngOnInit() {

        (this.container.nativeElement as HTMLDivElement).style.height = this.y * this.caseSize + "px";
        (this.container.nativeElement as HTMLDivElement).style.width = this.x * this.caseSize + "px";

        // init
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
            div.innerHTML = item.id > 0 ? item.id.toString() : "";
            div.style.fontSize = "6px";
            div.style.width = (this.caseSize - 2) + "px";
            div.style.height = (this.caseSize - 2) + "px";
            div.style.border = "1px solid black";
            div.style.position = "absolute";
            div.style.zIndex = "2";
            div.style.top = (y - 1) * this.caseSize + "px";
            div.style.left = (x - 1) * this.caseSize + "px";
            div.ondragenter = (e) => {
                this.dragenter(x, y);
            };
            (this.container.nativeElement as HTMLDivElement).appendChild(div);
            this.map.get(x, y).div = div;
        });

        this.items.forEach(item => {
            const div = document.createElement("div");
            div.style.background = "url(assets/img/" + item.img + ")";
            div.style.backgroundSize = this.caseSize * item.w + "px " + this.caseSize * item.h + "px";
            div.style.width = this.caseSize * item.w + "px";
            div.style.height = this.caseSize * item.h + "px";
            div.style.position = "absolute";
            div.style.zIndex = "3";
            div.style.top = (item.y - 1) * this.caseSize + "px";
            div.style.left = (item.x - 1) * this.caseSize + "px";
            div.draggable = true;
            div.ondragstart = (e) => {
                console.log("ondragstart");
                this.items.forEach(item1 => {
                    // item1.div.style.zIndex = "1";
                    // item1.div.style.pointerEvents = "none";
                    // item1.div.style.top = "200px";
                });
            };
            div.ondragend = (e) => {
                console.log("ondragend");
                this.items.forEach(item1 => {
                    // item1.div.style.zIndex = "3";
                    // item1.div.style.pointerEvents = "";
                    // item1.div.style.top = "0px";
                });
            };
            (this.container.nativeElement as HTMLDivElement).appendChild(div);
            this.items.get(item.id).div = div;
        });
    }

    dragenter(x: number, y: number): void {
        this.resetHover();
        let selX = x;
        if (x + 2 > this.x) {
            selX = this.x - 2 + 1;
        }
        let selY = y;
        if (y + 3 > this.y) {
            selY = this.y - 3 + 1;
        }
        for (let i = selX; i < selX + 2; i++) {
            for (let j = selY; j < selY + 3; j++) {
                const selItem = this.map.get(i, j);
                this.hover.push(selItem.div);
                selItem.div.style.backgroundColor = "lightcoral";
            }
        }
    }

    resetHover(): void {
        this.hover.forEach(item => {
            item.style.backgroundColor = "";
        });
        this.hover = [];
    }

    mouseout(): any {
        this.resetHover();
    }
}
