import {EventEmitter, Injectable, Output} from "@angular/core";
import {InventoryComponent} from "../components/inventory.component";

@Injectable()
export class InventoryhandlerService {
    dragItem: { name: string, id: number, w: number, h: number, img: string, x: number, y: number, div: HTMLDivElement } = null;

    private inc = 0;
    private map: Map<number, InventoryComponent> = new Map();
    private draggingComponentId: number = null;

    @Output() dragStartEmitter = new EventEmitter<{ componentId: number }>();
    @Output() dragStopEmitter = new EventEmitter<{ componentId: number }>();
    @Output() dragEnterEmitter = new EventEmitter<{ componentId: number }>();
    @Output() dropEmitter = new EventEmitter<{ componentId: number, fromX: number, fromY: number, toX: number, toY: number, collision: boolean }>();

    register(component: InventoryComponent): number {
        this.map.set(this.inc, component);
        return this.inc++;
    }

    unregister(componentId: number): void {
        this.map.delete(componentId);
    }

    dragStart(componentId: number, item: { name: string, id: number, w: number, h: number, img: string, x: number, y: number, div: HTMLDivElement }): void {
        this.draggingComponentId = componentId;
        this.dragItem = item;
        this.dragStartEmitter.emit({componentId});
    }

    dragStop(componentId: number): void {
        this.draggingComponentId = null;
        this.dragItem = null;
        this.dragStopEmitter.emit({componentId});
    }

    dragEnter(componentId: number): void {
        this.dragEnterEmitter.emit({componentId});
    }

    drop(componentId: number, x: number, y: number, collision: boolean): void {
        this.dropEmitter.emit({componentId, fromX: this.dragItem.x, fromY: this.dragItem.y, toX: x, toY: y, collision});
    }
}
