import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UserAdminComponent } from './user-admin.component';
import { RolesComponent } from './roles.component';
import { SaraComponentsModule } from '../components.module';

const adminRoutes: Routes = [
	{
		path: '', component: AdminComponent,
		children: [
			{ path: '', component: UserAdminComponent },
			{ path: ':id', component: UserAdminComponent },
		]
	}
];

@NgModule({
	declarations: [
		AdminComponent,
		UserAdminComponent,
		RolesComponent
	],
	imports: [
		RouterModule.forChild(adminRoutes),
		CommonModule,
		SaraComponentsModule
	]
})
export class UserAdminModule { }
