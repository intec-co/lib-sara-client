import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { RoutesService, SessionService } from '../services';
import { MenuSara, App, MenuOption } from './menu';

export abstract class SetupApp implements CanActivate {
	protected abstract option: App;
	protected options: Array<MenuOption> = [];
	protected optionsList: any = {};
	protected routesAllowed: Set<string> = new Set();

	constructor(
		private routes: RoutesService,
		private session: SessionService
	) {
		this.routes.whenCompleted().subscribe(() => {
			this.options = [];
			this.buildOptions();
		});
	}

	abstract buildOptions(): void;
	abstract setup(route: string, params?: any): void;

	protected conf(route: string, params?: any) {
		for (const option in params) {
			if (this.options[option] === undefined) {
				this.optionsList[option] = params[option];
			} else if (this.optionsList[option] && !params[option]) {
				this.optionsList[option] = false;
			}
		}
		this.routes.allow(route);
		this.option.route = route;
		this.session.setApp(this.option);
	}

	canActivate(routeActivate: ActivatedRouteSnapshot) {
		const route = routeActivate.url[0].path;
		return this.routesAllowed.has(route);
	}

	protected confOption(conf: MenuOption) {
		this.options.push(conf);
		this.routesAllowed.add(conf.route);
	}
	get menu(): MenuSara {
		const menu: MenuSara = {
			header: {
				title: this.option.name,
				icon: this.option.icon
			}
		};
		if (this.options.length) {
			menu.options = this.options;
		}
		return menu;
	}
}
