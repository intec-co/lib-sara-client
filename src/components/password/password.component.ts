import { Component, Input } from '@angular/core';

import { TransactionsService } from '../../services';

@Component({
	selector: 'password',
	templateUrl: './password.component.html'
})

export class PasswordComponent {
	@Input() user: number;

	password1: string;
	password2: string;
	error;
	errorMsg;
	sub;
	id;
	disabled = true;
	alertClass = '';

	constructor(private post: TransactionsService) { }

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

		if (pwd1.length < 6) {
			this.disabled = true;
			this.errorMsg = 'La contraseña debe tener al menos 6 caracteres';
			this.alertClass = 'text-danger';
			this.error = true;
		} else if (pwd1 !== pwd2) {
			this.disabled = true;
			this.errorMsg = 'Las contraseñas deben ser iguales';
			this.alertClass = 'text-danger';
			this.error = true;
		} else {
			this.error = false;
			this.disabled = false;
		}
	}

	change() {
		this.disabled = true;
		const obj = {
			password: this.password1,
			user: this.user
		};
		this.post.write('userCredentials', obj).subscribe();
		this.errorMsg = 'La contraseña se cambio con éxito';
		this.alertClass = 'text-accent';
		this.error = true;
	}

}
