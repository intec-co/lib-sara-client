import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ClarityIcons } from '@clr/icons';
import { ClrShapeBarChart } from '@clr/icons/shapes/chart-shapes';
import { ClrShapeEnvelope } from '@clr/icons/shapes/social-shapes';
import { ClrShapeImageGallery } from '@clr/icons/shapes/media-shapes';
import { ClrShapeApplications } from '@clr/icons/shapes/technology-shapes';
import {
	App,
	MenuOption,
	MenuTitle
} from '../../class';
import {
	MenuService,
	RoutesService
} from '../../services';
import { SaraDeskService } from './sara-desk.service';

ClarityIcons.add({
	applications: ClrShapeApplications,
	mail: ClrShapeEnvelope,
	barchart: ClrShapeBarChart,
	gallery: ClrShapeImageGallery
});

@Component({
	selector: 'menu-desk-sara',
	templateUrl: './menu-desk-sara.component.html',
	styleUrls: ['menu-desk-sara.component.css']
})
export class MenuDeskComponent {
	tabSelected = 'apps';
	showTabs = true;
	appOpened: string;
	optionOpened: MenuOption;

	_apps: Array<App>;
	_history: Array<Event>;
	_menu: Array<MenuOption>;
	_subMenu: Array<MenuOption>;
	_header: MenuTitle;
	_subHeader: MenuTitle;

	show = false;

	@Input() set apps(apps: Array<App>) {
		this._apps = apps;
		this.check();
	}
	@Input() history = true;

	constructor(
		private router: Router,
		private menuService: MenuService,
		private routes: RoutesService,
		private breakpointObserver: BreakpointObserver,
		private saraDesk: SaraDeskService
	) {
		this.menuService.menu$.subscribe(value => {
			this._header = undefined;
			this._menu = undefined;
			this._subMenu = undefined;
			if (value) {
				this._header = value.header;
				this.tabSelected = 'menu';
				this._menu = value.options;
			}
			this.check();
		});
		this.menuService.subMenu$.subscribe(value => {
			this._subMenu = undefined;
			if (value) {
				this._subHeader = value.header;
				this._subMenu = value.options;
			}
		});
	}

	check() {
		this.appOpened = this.routes.app;
		if (this._menu) {
			this.tabSelected = 'menu';
		}
		if (
			(this._apps && this._apps.length) ||
			(this._menu && this._menu.length) ||
			this.history) {
			this.show = true;
		} else {
			this.show = false;
		}
		this.menuService.show = this.show;
	}
	openApp(appRoute: string) {
		this.router.navigate(['/', appRoute]);
		this.tabSelected = 'menu';
	}

	openRoute(item: MenuOption) {
		if (this.breakpointObserver.isMatched('(max-width: 599px)')) {
			this.saraDesk.menu(false);
		}
		this._subHeader = undefined;
		this._subMenu = undefined;
		let route: Array<string>;
		if (item.app) {
			route = ['/', item.app, item.route];
		} else {
			route = ['/', this.appOpened, item.route];
		}
		if (item.fragment) {
			this.router.navigate(route, { fragment: item.fragment });
		} else {
			this.router.navigate(route);
		}
	}

	openRouteSub(option: MenuOption) {
		let url = [];
		if (this._subHeader.url) {
			url.push(this.appOpened);
			url = url.concat(this._subHeader.url);
		} else {
			url.push(this.router.url);
		}
		url.push(option.route);
		this.router.navigate(url);
	}
}
