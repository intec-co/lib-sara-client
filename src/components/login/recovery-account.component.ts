import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService, TransactionsService } from '../../services';

@Component({
	selector: 'recovery-account',
	templateUrl: './recovery-account.component.html'
})
export class RecoveryAccountComponent implements OnInit, AfterViewInit {
	@ViewChild('userInput', { static: false }) userInput: ElementRef;

	user: string;
	msg = false;

	constructor(
		private router: Router,
		private session: SessionService,
		private post: TransactionsService
	) { }

	ngOnInit() {
		if (this.session.isValid) {
			this.router.navigate(['']);
		}
	}
	recovery() {
		const obj = {
			crud: 'generate',
			user: this.user
		};
		this.post.raw('public/RecoverAccount', obj).subscribe(
			res => this.msg = true
		);
		this.user = '';
	}
	ngAfterViewInit() {
		this.userInput.nativeElement.focus();
	}
}
