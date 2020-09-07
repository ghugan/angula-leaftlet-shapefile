import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from "./app.component";
import { MarkersService } from "./services/markers/markers.service";
import { PlottingService } from "./services/plotting/plotting.service";
import { ShapeService } from "./services/shape/shape.service";

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		HttpClientModule

	],
	providers: [MarkersService, PlottingService, ShapeService],
	bootstrap: [AppComponent]
})
export class AppModule { }
