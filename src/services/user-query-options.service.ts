import { Injectable } from '@angular/core';
import { MenuService, } from '../services/menu.service';
import { MenuSara, MenuOption } from '../class/menu';

@Injectable({
	providedIn: 'root'
})
export class UserQueryOptionsService {
	private _menu: MenuSara;
	private _priority: Array<string>;
	private id: number;
	private mapOptions: Map<string, MenuOption> = new Map();

	constructor(
		private menu: MenuService
	) { }

	setMenu() {
		const options: Array<MenuOption> = [];
		if (this._priority) {
			this._priority.forEach(optionApp => {
				if (this.mapOptions.has(optionApp)) {
					const option: MenuOption = JSON.parse(JSON.stringify(this.mapOptions.get(optionApp)));
					option.route = `${this.id}`;
					options.push(option);
				}
			});
		}
		this._menu = {
			header: {
				title: 'Usuarios',
				icon: 'user'
			},
			options
		};
		this.menu.menu = this._menu;
	}
	set userId(value: number) {
		this.id = value;
	}
	get userId(): number {
		return this.id;
	}
	set priority(value: Array<string>) {
		this._priority = value;
	}
	setOption(option: MenuOption) {
		this.mapOptions.set(option.app, option);
	}
}
