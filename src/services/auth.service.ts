import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import { SessionService } from './session.service';
import { TransactionsService } from './transactions.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

	ips = [];
	user: string;
	password: string;
	exe = true;
	expires;
	constructor(
		private router: Router,
		private session: SessionService,
		private post: TransactionsService
	) { }

	public login(user: string, password: string, callback) {
		this.user = user;
		this.password = password;
		const date = new Date().getTime();
		const keyToken = {
			id: this.post.saraId,
			ts: date
		};
		const key = btoa(JSON.stringify(keyToken));
		const hash = sha256(sha256(password) + '$' + key);
		localStorage.lastUse = date;
		const req: any = {
			route: 'auth',
			operation: 'validate',
			data: {
				user,
				token: hash,
				key
			},
			date,
			count: 0
		};
		this.post.raw('auth', req).subscribe(
			res => this.process(user, res, callback)
		);
	}

	private process(user, res, callback) {
		if (res.isValid === true) {
			const session = res.data;
			this.user = '';
			this.password = '';
			this.session.register(session);
			this.router.navigate(['/']);
		}
	}
	public registerIP(ip) {
		this.ips.push(ip);
	}
}
