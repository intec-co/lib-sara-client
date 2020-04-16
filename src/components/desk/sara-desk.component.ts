import { Component, Inject, Input, OnInit, HostBinding } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MenuService, SessionService } from '../../services';
import { SaraDeskService } from './sara-desk.service';

@Component({
	template: `<div><span class="mat-h2 text-primary">Cambiar Contraseña</span></div>
						<br>
						<password [user]="data.id"></password>`,
	styles: ['scroll { scroll: auto; }']
})
export class ChangePassDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<ChangePassDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data
	) {
		window.addEventListener('message', (event) => {
			this.dialogRef.close(event);
		}, false);
	}
}

@Component({
	selector: 'sara-desk',
	templateUrl: './sara-desk.component.html',
	styleUrls: ['./sara-desk.component.scss']
})
export class SaraDeskComponent implements OnInit {
	@Input() userInfo;
	@Input() logo;
	@Input() menuFixed = false;

	@HostBinding('class') componentCssClass;

	changeThemeTo: string;

	showMenu = false;
	events = [];
	opened = true;

	date = new Date();
	constructor(
		private menu: MenuService,
		private dialog: MatDialog,
		private sideMenu: SaraDeskService,
		private session: SessionService,
		public overlayContainer: OverlayContainer
	) {
		let theme = localStorage.getItem('theme');
		if (!theme) {
			theme = 'Claro';
			localStorage.setItem('theme', theme);
		}
		this.setTheme(theme);
	}

	ngOnInit() {
		if (this.menuFixed) {
			this.showMenu = true;
		} else {
			setTimeout(() => {
				this.showMenu = this.menu.show;
				this.menu.show$.subscribe(value => this.showMenu = value);
			}, 0);
		}
		this.sideMenu.toggle$.subscribe(state => this.opened = state);
	}
	logout() {
		this.session.logout();
	}
	_changePassword() {
		const dialogRef = this.dialog.open(ChangePassDialogComponent, {
			width: '600px',
			data: {
				id: this.userInfo.id
			}
		});

		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
		});
	}
	changeTheme() {
		localStorage.setItem('theme', this.changeThemeTo);
		this.setTheme(this.changeThemeTo);
	}
	setTheme(theme) {
		let newTheme: string;
		if (theme === 'Oscuro') {
			this.changeThemeTo = 'Claro';
			newTheme = 'dark-theme';
		} else if (theme === 'Claro') {
			this.changeThemeTo = 'Oscuro';
			newTheme = 'light-theme';
		}
		this.overlayContainer.getContainerElement().classList.add(newTheme);
		this.componentCssClass = newTheme;
	}
}
