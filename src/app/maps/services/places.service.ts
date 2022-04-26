import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class PlacesService {

public useLocation?: [number, number];

	get isUserLocationReady(): boolean {
		return !!this.useLocation; //Primer navegación es que tenga un valor y el segundo es la negación
	}

	constructor() {
		this.getUserLocation();
	}

	public async getUserLocation(): Promise<[number, number]> {
		return new Promise( (resolve, reject) => {
			navigator.geolocation.getCurrentPosition(
				( { coords } ) =>  {
					this.useLocation = [ coords.longitude, coords.latitude ]
					console.log(this.useLocation)
					resolve( this.useLocation )
				},
				( err ) => {
					alert('No se pueo obtener la geolocalizacion')
					console.log(err);
					reject();

				}
			);
		});
	}
}
