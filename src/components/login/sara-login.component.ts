import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, SessionService } from '../../services';

@Component({
	selector: 'sara-login',
	templateUrl: './sara-login.component.html'
})
export class LoginComponent implements OnInit {
	loginInfo = {
		user: '',
		password: ''
	};
	user: string;
	password: string;
	error = false;

	constructor(
		private auth: AuthService,
		private router: Router,
		private session: SessionService
	) { }

	ngOnInit() {
		if (this.session.isValid) {
			this.router.navigate(['']);
		}
	}
	login() {
		this.auth.login(this.user, this.password, () => {
			this.error = true;
		});
		this.user = '';
		this.password = '';
	}
	handleKeyDown(event: any) {
		if (event.keyCode === 13) {
			if (!this.user) {
				this.error = true;
			} else if (!this.password) {
				this.error = true;
			} else {
				this.login();
			}
		}
	}
}
