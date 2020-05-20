import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {InventoryComponent} from "../_core/components/inventory.component";
import {InventoryService} from "../_core/services/inventory.service";
import {InventoryhandlerService} from "../_core/services/inventoryhandler.service";

@NgModule({
    declarations: [
        AppComponent,
        InventoryComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [
        InventoryService,
        InventoryhandlerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
