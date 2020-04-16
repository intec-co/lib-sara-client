import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'button-desk',
	templateUrl: './button-desk.component.html'
})
export class ButtonDeskComponent implements OnInit {
	@Input() title: string;
	@Input() route: string;
	@Input() icon: string;
	@Input() color: string;
	textColor: string;

	constructor(
		private router: Router
	) {

	}
	ngOnInit() {
		this.textColor = "desk-button-" + this.color;
	}
	navigate() {
		this.router.navigate([this.route]);
	}
}
