import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {ItemsgridComponent} from "../_core/components/itemsgrid.component";
import {InventoryService} from "../_core/services/inventory.service";

@NgModule({
    declarations: [
        AppComponent,
        ItemsgridComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [
        InventoryService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
