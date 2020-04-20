import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { TransactionsService, RolesAppService } from '../../services';

@Component({
	selector: 'roles',
	templateUrl: './roles.component.html',
	styleUrls: ['./roles.component.css']
})
export class RolesComponent {
	userId: number;
	roles: Array<any>;
	subscriptionRouter: Subscription;
	show = false;

	constructor(
		private post: TransactionsService,
		private route: ActivatedRoute,
		private rolesApp: RolesAppService
	) {
		this.route.paramMap.subscribe((params: ParamMap) => {
			this.loadData(+params.get('id'));
		});
	}
	loadData(id) {
		const personId = id;
		this.show = false;
		if (personId) {
			this.show = true;
			const fullList = this.rolesApp.list;
			this.userId = +personId;
			this.post.read('roles', { user: this.userId })
				.subscribe(res => {
					this.roles = [];
					if (res) {
						for (const role of res.roles) {
							fullList.delete(role);
							this.roles.push({ name: role, color: 'accent', isSelected: true });
						}
					}
					const unsetRoles = Array.from(fullList);
					for (const role of unsetRoles) {
						this.roles.push({ name: role, color: '', isSelected: false });
					}
				});
		} else {

		}
	}
	setRole(index) {
		if (this.roles[index].isSelected) {
			this.roles[index].isSelected = false;
			this.roles[index].color = '';
		} else {
			this.roles[index].isSelected = true;
			this.roles[index].color = 'accent';
		}
		const data = {
			user: this.userId,
			roles: []
		};
		for (const role of this.roles) {
			if (role.isSelected) {
				data.roles.push(role.name);
			}
		}
		this.post.write('roles', data).subscribe();
	}
}
