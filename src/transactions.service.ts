import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RandomString } from './random';
import { LocalIp } from './localIp';

interface Params {
	project?: any;
	limit?: any;
	link?: any;
}

/**
 * Comunicación con el servidor
 */
@Injectable({ providedIn: 'root' })
export class TransactionsService {
	private ips = [];
	private _saraId;
	private counter = 0;
	private logout;
	private token: string;

	constructor(
		private http: HttpClient,
		private router: Router
	) {
		let saraId;
		if (localStorage.getItem('saraid')) {
			saraId = localStorage.getItem('saraid');
		} else {
			saraId = new RandomString(10).string;
			localStorage.setItem('saraid', saraId);
		}
		this.token = localStorage.getItem('token');
		this._saraId = saraId;
		this.ips.push(saraId);
		const localIp = new LocalIp(
			ip => this.ips.push(ip));
	}
	get auth(): string {
		if (!this.token) {
			this.token = localStorage.getItem('token');
		}
		return this.token;
	}

	get saraId(): string {
		return this._saraId;
	}

	public raw(route: string, data: any): Observable<any> {
		const date = new Date().getTime().toString();
		const objHeaders: any = {
			'Content-Type': 'application/json'
		};
		if (this.auth) {
			objHeaders.Authorization = this.auth;
		}
		const options = {
			headers: new HttpHeaders(objHeaders)
		};
		data.route = route;
		data.date = date;
		return this.http.post(`trs/${route}`, data, options);
	}
	/**
	 * Transaction with server
	 * @param ruta  Ruta en el servidor para procesar el paquete.
	 * @param operation  Operation type enum of Operation.
	 * @param data  Data to send of server.
	 * @param params  Params of query.
	 */
	private send(route: string, operation: string, data: any, params?: Params): Observable<any> {
		const date = new Date().getTime().toString();
		localStorage.setItem('lastUse', date);
		const req: any = {
			_v: 3,
			route,
			operation,
			data,
			date,
			count: this.counter,
			ips: this.ips
		};
		if (params) {
			req.params = params;
		}
		this.counter++;
		const objHeaders: any = {
			'Content-Type': 'application/json'
		};
		if (this.auth) {
			objHeaders.Authorization = this.auth;
		}
		const options = {
			headers: new HttpHeaders(objHeaders)
		};
		return this.http.post(`trs/${route}`, req, options).pipe(
			catchError(err => {
				console.error('Ha ocurrido un error en la transacción: ', err);
				return throwError(err);
			}),
			map(
				res => this.process(res)
			));
	}

	private process(res) {
		if (res.isValid) {
			if (res.error) {
				console.error(res.error);
			}
			if (res.msg) {
				console.log(res.msg);
			}
			return res.data;
		} else {
			this.logout();
			return res.data;
		}
	}
	public write(route: string, data: any, params?: Params): Observable<any> {
		return this.send(route, 'write', data, params);
	}
	public set(route: string, data: any, params?: Params): Observable<any> {
		return this.send(route, 'set', data, params);
	}
	public create(route: string, data: any, params?: Params): Observable<any> {
		return this.send(route, 'create', data, params);
	}
	public read(route: string, data: any, params?: Params): Observable<any> {
		return this.send(route, 'read', data, params);
	}
	public readList(route: string, data: any, params?: Params): Observable<Array<any>> {
		return this.send(route, 'readList', data, params);
	}
	public count(route: string, data: any, params?: Params): Observable<number> {
		return this.send(route, 'count', data, params);
	}
	public erase(route: string, data: any, params?: Params): Observable<number> {
		return this.send(route, 'erase', data, params);
	}

	public setLogout(callback) {
		this.logout = callback;
	}

	private handleError(error: any) {
		return (error2: any): Observable<any> => {

			// TODO: send the error to remote logging infrastructure
			console.error(error2); // log to console instead

			// TODO: better job of transforming error for user consumption
			// this.log(`${operation} failed: ${error.message}`);

			// Let the app keep running by returning an empty result.
			return of(error2);
		};


		/*let errMsg = 'transaction error';
		console.error('An error occurred');
		console.error(error);
		return Observable.throw(errMsg);*/
	}
}
