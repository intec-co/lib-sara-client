import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserQueryOptionsService } from '../../services';
import { SetupUserAdminService } from './setup';

@Component({
	templateUrl: './user-admin.component.html'
})
export class UserAdminComponent implements OnInit {
	id: number;
	constructor(
		private route: ActivatedRoute,
		private userQuery: UserQueryOptionsService,
		private setup: SetupUserAdminService
	) { }

	ngOnInit() {
		this.route.paramMap.subscribe((params: ParamMap) => {
			this.id = +params.get('id');
			if (this.setup.asMenu) {
				this.userQuery.userId = this.id;
				this.userQuery.setMenu();
			} else {
				this.setup.setMenu();
			}
		});
	}
}
