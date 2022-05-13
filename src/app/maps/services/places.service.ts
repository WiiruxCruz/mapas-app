import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlacesResponse, Feature } from '../interfaces/places';
import { PlacesApiClient } from '../api';
import { MapService } from './map.service';

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

	constructor(
		private http: PlacesApiClient,
		private mapService: MapService
	) {
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

		if( query.length === 0 ) {
			this.isLoadingPLaces = false;
			this.places = [];
			return;
		}

		if( !this.useLocation ) throw Error('No hay userLocation')

		this.isLoadingPLaces = true;

		this.http.get<PlacesResponse>(`/${ query }.json`, {
				params: {
					proximity: this.useLocation?.join(',')
				}
			}
		)
		.subscribe( resp => {
				this.isLoadingPLaces = false;
				this.places = resp.features;

				this.mapService.createMarkersFromPlaces( this.places, this.useLocation! );
			}
		);
	}
}
