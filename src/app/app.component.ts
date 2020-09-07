import { Component, AfterViewInit } from "@angular/core";
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as shp from "shpjs";
import * as JSZip from 'jszip';
import { MarkersService } from "./services/markers/markers.service";

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
	iconRetinaUrl,
	iconUrl,
	shadowUrl,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;
@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit {
	private map;
	marker: L.MarkerClusterGroup;

	constructor(private markerService: MarkersService) {

	}
	ngAfterViewInit() {
		this.initMap();


	}

	private initMap(): void {
		this.map = L.map('map', {
			center: [39.8282, -98.5795],
			zoom: 3
		})

		this.marker = L.markerClusterGroup({
			chunkedLoading: true
		});
		const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		tiles.addTo(this.map);
	}

	submit(files) {
		console.log(files);
		//	this.spinner.show();
		const self = this;
		if (files.length === 0) {
			return; //do nothing if no file given yet
		}

		const fil = files[0];

		if (fil.name.slice(-3) != 'zip') {
			document.querySelector('#warning').innerHTML = "Select a .zip file";
			//	self.spinner.hide();
			return;

		}
		else {
			var zip = new JSZip();
			zip.loadAsync(fil /* = file blob */)
				.then(function (val) {
					// process ZIP file content here
					console.log(Object.keys(val.files).filter(x => x.endsWith(".shp")));
					if (Object.keys(val.files).filter(x => x.endsWith(".shp")).length > 0) {
						document.querySelector('#warning').innerHTML = '';
						//self.handleZipFile(files[0]);
						self.markerService.handleZipFile(files[0], self.map, self.marker);

					}
					else {
						document.querySelector('#warning').innerHTML = "Invalid shapefile";
						//	self.spinner.hide();
					}
				});


		}
	}
}
