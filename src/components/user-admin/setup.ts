import { Injectable } from '@angular/core';
import {
	RoutesService,
	SessionService,
	UserQueryOptionsService,
	MenuService
} from '../../services';

import { } from '../../services';
export interface UserAdminOptions {
	asMenu?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SetupUserAdminService {
	_asMenu: boolean;
	option = {
		name: 'Usuarios',
		route: '',
		img: 'system-config.png',
		icon: 'administrator',
		desc: 'Información, Roles y Contraseñas'
	};

	constructor(
		private routes: RoutesService,
		private session: SessionService,
		private userQuery: UserQueryOptionsService,
		private menu: MenuService
	) {
		this.routes.whenCompleted().subscribe(() => {
		});
	}

	setup(route: string, params?: UserAdminOptions) {
		if (params) {
			if (params.asMenu) {
				this._asMenu = true;
				this.userQuery.setOption(
					{
						title: 'Administración de usuario',
						app: route,
						route: '',
						icon: 'administrator'
					});
			} else {
				this.setApp();
			}
		} else {
			this.setApp();
		}
		this.option.route = route;
		this.routes.allow(route);
		this.session.setTool('search');
	}
	setApp() {
		this.session.setApp(this.option);
	}
	setMenu() {
		this.menu.menu = {
			header: {
				title: 'Usuarios',
				icon: 'administrator'
			},
			options: [
				{
					title: 'Nuevo Usuario',
					route: '',
					icon: 'plus-circle'
				}, {
					title: 'Lista de Usuarios',
					route: 'list',
					icon: 'list'
				}
			]
		};
	}
	get asMenu(): boolean {
		return this._asMenu;
	}
}
