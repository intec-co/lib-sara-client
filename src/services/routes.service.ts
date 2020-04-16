import { Injectable } from '@angular/core';
import { Router, CanActivate, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoutesService implements CanActivate {
	private _routes: Set<string>;
	private isCompleted = false;
	private isActived = false;
	private _app;
	private completedNotifier: Subject<boolean> = new Subject();

	constructor(
		private router: Router
	) {
		this.router.events.subscribe(e => {
			if (e instanceof NavigationEnd) {
				this.isActived = true;
				if (this.isCompleted) {
					this.verify();
				}
			}
		});
	}

	get app() {
		return this._app;
	}
	get routes() {
		return this._routes;
	}

	allow(route) {
		if (!this._routes) {
			this._routes = new Set();
		}
		this._routes.add(route);
	}
	isAllow(route) {
		return this._routes.has(route);
	}
	completed() {
		this.isCompleted = true;
		this.completedNotifier.next(true);
		if (this.isActived) {
			this.verify();
		}
	}
	whenCompleted(): Observable<boolean> {
		return this.completedNotifier.asObservable();
	}
	verify() {
		let route = this.router.url.split('/')[1];
		route = route.split('?')[0];
		route = route.split('#')[0];
		if (!this.isAllow(route)) {
			this.router.navigate(['']);
		}
	}
	canActivate(routeActivate: ActivatedRouteSnapshot): Observable<boolean> {
		this._app = routeActivate.url[0].path;
		if (this.isCompleted) {
			if (this._routes.has(this._app)) {
				return of(true);
			} else {
				window.alert('No tiene permisos para esta ruta');
				this.router.navigate(['']);
				return of(false);
			}
		} else {
			return this.completedNotifier;
		}
	}
}
