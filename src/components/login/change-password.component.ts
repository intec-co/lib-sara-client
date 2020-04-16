import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, TransactionsService } from '../../services';

@Component({
	selector: 'change-password',
	templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {
	@ViewChild('pw1', { static: false }) pw1: ElementRef;
	password1: string;
	password2: string;
	error;
	errorMsg;
	sub;
	user;
	token;
	id;
	disabled = true;

	constructor(
		private auth: AuthService,
		private router: Router,
		private route: ActivatedRoute,
		private post: TransactionsService
	) { }

	ngOnInit() {
		this.sub = this.route
			.queryParams
			.subscribe(params => {
				this.user = +params.user || 0;
				this.token = params.token || '';
				this.id = params.id || '';
				if (this.user === 0 || this.token === '') {
					this.errorMsg = 'Enlace no valido para cambio de contraseña';
					this.error = true;
				}
			});
	}
	verifyPassword(idx?: number, value?: string) {
		let pwd1: string;
		let pwd2: string;
		if (idx && value) {
			if (idx === 1) {
				pwd1 = value;
			} else if (idx === 2) {
				pwd2 = value;
			}
		}
		if (!pwd1) {
			pwd1 = this.password1;
		}
		if (!pwd2) {
			pwd2 = this.password2;
		}
		if (!pwd1 && pwd1.length < 6) {
			this.disabled = true;
			this.errorMsg = 'La contraseña debe tener al menos 6 caracteres';
			this.error = true;
		} else if (pwd1 !== pwd2) {
			this.disabled = true;
			this.errorMsg = 'Las contraseñas deben ser iguales';
			this.error = true;
		} else {
			this.error = false;
			this.disabled = false;
		}
	}

	change() {
		const obj = {
			crud: 'change',
			user: this.user,
			token: this.token,
			password: this.password1
		};
		this.post.raw('public/RecoverAccount', obj).subscribe(
			(res: any) => {
				if (res.isValid) {
					this.auth.login(this.id, this.password1, () => {
						this.router.navigate(['']);
						this.error = true;
						console.error('error set password');
					});
				} else {
					this.errorMsg = 'El cambio de contraseña expiro. Por favor solicite un nuevo cambio';
					this.error = true;
				}
			}
		);
	}
	ngAfterViewInit() {
		this.pw1.nativeElement.focus();
	}
}
