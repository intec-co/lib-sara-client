import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuSara, App } from '../class'

@Injectable({ providedIn: 'root' })
export class MenuService {
	private _show = false;

	private sShow = new Subject<boolean>();
	private sMenu = new Subject<MenuSara>();
	private sSubMenu = new Subject<MenuSara>();
	private sApp = new Subject<App>();

	show$ = this.sShow.asObservable();
	menu$ = this.sMenu.asObservable();
	subMenu$ = this.sSubMenu.asObservable();
	app$ = this.sApp.asObservable();

	set show(value: boolean) {
		this._show = value;
		this.sShow.next(value);
	}
	get show() {
		return this._show;
	}
	set menu(values: MenuSara) {
		this.sMenu.next(values);
	}
	set subMenu(values: MenuSara) {
		this.sSubMenu.next(values);
	}
}
