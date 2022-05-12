import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlacesResponse, Feature } from '../interfaces/places';

@Injectable({
	providedIn: 'root'
})
export class PlacesService {

public useLocation?: [number, number];

public isLoadingPLaces: boolean = false;
public places: Feature[] = [];

	get isUserLocationReady(): boolean {
		return !!this.useLocation; //Primer navegación es que tenga un valor y el segundo es la negación
	}

	constructor( private http: HttpClient) {
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

	getPlacesByQuery( query: string = '' ) {
		this.isLoadingPLaces = true;
		this.http.get<PlacesResponse>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${ query }.json?proximity=-99.1365151461231%2C19.445519042186064&types=place%2Cpostcode%2Caddress&language=es&access_token=pk.eyJ1Ijoid2lpcnV4Y3J1eiIsImEiOiJjbDBodDhjbTkwN3BmM2Vxd3ZuY21reG85In0.J6npKCfkCbG86unIOUzWaQ`)
		.subscribe( resp => {
				console.log( resp.features )

				this.isLoadingPLaces = false;
				this.places = resp.features;
			}
		);
	}
}
