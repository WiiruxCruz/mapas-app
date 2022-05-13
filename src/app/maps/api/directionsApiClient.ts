import { Injectable } from "@angular/core";
import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
	providedIn: 'root'
})
export class DirectionsApiClient extends HttpClient {
	public baseUrl: string = 'https://api.mapbox.com/directions/v5/mapbox/driving';

	constructor( handler: HttpHandler ) {
		super( handler );
	}

	public get<T>( url: string ) {
		url = this.baseUrl + url;

		return super.get<T>( url, {
				params: {
					alternatives: 'false',
					geometries: 'geojson',
					language: 'es',
					overview: 'simplified',
					steps: 'false',
					access_token: environment.apiKey
				}
			}
		);
	}
}
