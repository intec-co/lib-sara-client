import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RolesAppService {
	private _list = new Set<string>();
	set array(list: Array<any>) {
		for (let item of list)
			this._list.add(item);
	}
	get array(): Array<any> {
		return Array.from(this._list.entries());
	}
	get list() {
		return new Set<string>(this._list);
	}
	existRole(role) {
		return this._list.has(role);
	}
}
