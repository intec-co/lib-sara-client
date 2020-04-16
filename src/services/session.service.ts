import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TransactionsService } from './transactions.service';
import { map, first } from 'rxjs/operators';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { App } from '../class/menu';

@Injectable({ providedIn: 'root' })
export class SessionService implements CanActivate {
	private _login = false;
	private processRolesCallback: () => void;
	private _preload: Array<() => Observable<any>>;
	private isLoaded = false;

	private auth = false;
	private _userId: number;
	private _user;
	private _tools: any = {};
	private _toolsSet: Set<string> = new Set();
	private _roles: Array<string>;
	private rolesSet: Set<string>;
	private _apps: Array<any> = [];
	private appSet = new Set<string>();

	private canActivateSubject = new Subject<boolean>();

	constructor(
		private router: Router,
		private post: TransactionsService
	) {
		this.post.setLogout(() => this.logout());
		this.auth = false;

		let auth: any = localStorage.getItem('token');
		if (auth) {
			try {
				this.auth = true;
				auth = auth.split('Sara ')[1];
				auth = JSON.parse(atob(auth));
			} catch {
				localStorage.removeItem('token');
				this.auth = false;
				return;
			}
			const data = { id: auth.uid };
			const qRoles = { user: auth.uid };
			forkJoin([
				this.post.read('person', data)
					.pipe(map((resPerson: any) => {
						if (resPerson) {
							this._userId = resPerson.id;
							this._user = resPerson;
						}
						return;
					})),
				this.post.read('roles', qRoles)
					.pipe(map((resRoles: any) => {
						if (resRoles) {
							this.roles = resRoles.roles;
						}
						return;
					}))
			]).subscribe(() => {
				this.announce();
			});
		} else {
			this.auth = false;
		}
	}

	canActivate(): Observable<boolean> {
		if (this.auth) {
			if (this.isLoaded) {
				return of(true);
			}
			return this.canActivateSubject.asObservable().pipe(first());
		} else {
			this.router.navigate(['login']);
			return of(false);
		}
	}
	registerProcessRoles(callback: () => void) {
		this.processRolesCallback = callback;
	}
	set preload(list: Array<() => Observable<boolean>>) {
		this._preload = list;
	}
	private announce() {
		if (this.processRolesCallback) {
			this.processRolesCallback();
		}
		if (this._preload && this._preload.length) {
			const observables = [];
			this._preload.forEach(obs => {
				observables.push(obs());
			});
			forkJoin(observables).subscribe(() => {
				this.isLoaded = true;
				this.canActivateSubject.next(true);
			});
		} else {
			this.isLoaded = true;
			this.canActivateSubject.next(true);
		}
	}

	register(data) {
		this._userId = data.person.id;
		this._user = data.person;
		this.roles = data.roles;
		this._login = true;
		localStorage.setItem('token', data.auth);
		this.auth = true;
		this.announce();
	}
	get login() {
		return this._login;
	}
	logout() {
		this.auth = false;
		delete this._userId;
		delete this._user;
		delete this._roles;
		this.rolesSet.clear();
		const req = {
			operation: 'logout',
			data: {}
		};
		this.post.raw('auth', req).subscribe();
		localStorage.removeItem('token');
		this.router.navigate(['login']);
	}
	get isValid(): boolean {
		return this.auth;
	}
	get userId(): number {
		return this._userId;
	}
	set userId(value: number) {
		this._userId = value;
	}
	get user(): any {
		return this._user;
	}
	set user(value: any) {
		this._user = value;
	}
	get roles(): Array<any> {
		return this._roles;
	}
	set roles(value: Array<any>) {
		this._roles = value;
		this.rolesSet = new Set();
		value.forEach(role => {
			this.rolesSet.add(role);
		});
	}
	hasRole(role): boolean {
		return this.rolesSet.has(role);
	}
	get tools() {
		return this._tools;
	}
	setTool(tool: string) {
		if (!this._toolsSet.has(tool)) {
			this._tools[tool] = true;
			this._toolsSet.add(tool);
		}
	}
	get apps() {
		return this._apps;
	}
	set apps(value) {
		this._apps = value;
	}
	setApp(app: App) {
		if (!this.appSet.has(app.name)) {
			this._apps.push(app);
			this.appSet.add(app.name);
		}
	}
}
