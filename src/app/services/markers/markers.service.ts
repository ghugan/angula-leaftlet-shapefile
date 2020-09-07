import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as shp from "shpjs";
import * as L from "leaflet";
import "leaflet.markercluster";
@Injectable({
	providedIn: 'root'
})
export class MarkersService {
	//capitals = './assets/convert.json';
	markers: any;
	capitals = '../../../assets/Market_Layer_PJU05/PJU_05.geojson';
	constructor(private http: HttpClient) {

	}

	handleZipFile(file, map, markers) {

		var self = this;
		var reader = new FileReader();

		reader.onload = function () {

			if (reader.readyState != 2 || reader.error) {
				document.querySelector('#warning').innerHTML = "Inappropriate shapefile";
				return;
			} else {

				self.convertToLayer(reader.result, map, markers);
			}
		}
		reader.readAsArrayBuffer(file);

	}


	convertToLayer(buffer, map, markers) {
		const self = this;
		console.log(buffer);


		shp(buffer).then(function (data) {

			const marker = L.geoJSON(data, {
				style: function (feature) {
					return { color: 'blue' }
				},
				onEachFeature: function popUp(f, l) {
					const out = [];
					if (f.properties) {
						for (const key of Object.keys(f.properties)) {
							out.push(key + " : " + f.properties[key]);
						}
						l.bindPopup(out.join("<br />"));
					}
				}
			});
			map.fitBounds(marker.getBounds());
			// marker.bindPopup("abc");
			markers.addLayer(marker);
			//	}
			map.addLayer(markers)

		});
		//	this.spinner.hide();
	}

	makeCapitalMarkers(map, markers) {
		const base = "./assets/convert.json";

		console.log(this.capitals);
		// this.http.get(this.capitals).subscribe((res: any) => {
		// 	console.log(res);
		// 	//	for (const c of res.features) {
		// 	//		const lat = c.geometry.coordinates[0];
		// 	//		const lon = c.geometry.coordinates[1];

		// });
	}

	makeCapitalCircleMarkers(map): void {
		const markers = L.markerClusterGroup({
			chunkedLoading: true
		});
		this.http.get(this.capitals).subscribe((res: any) => {
			for (const c of res.features) {
				const lat = c.geometry.coordinates[0];
				const lon = c.geometry.coordinates[1];
				const circle = L.circleMarker([lat, lon]);

				markers.addLayer(circle);
			}
			map.addLayer(markers)
			console.log(map);
		});

	}
}

