import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {InventoryService} from "../_core/services/inventory.service";
import {InventoryComponent} from "../_core/components/inventory.component";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    title = "protoInventory";

    @ViewChild("inventory1", {static: true}) inventory1: InventoryComponent;
    @ViewChild("inventory2", {static: true}) inventory2: InventoryComponent;

    constructor(protected inventoryService: InventoryService) {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.inventory1.setItems(this.inventoryService.getItems());
        }, 200);
        setTimeout(() => {
            this.inventory2.setItems(this.inventoryService.getItems2());
        }, 400);
    }
}
