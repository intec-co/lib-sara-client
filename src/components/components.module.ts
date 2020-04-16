import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonDeskComponent } from './desk/button-desk.component';
import { MenuDeskComponent } from './desk/menu-desk-sara.component';
import { ChangePassDialogComponent, SaraDeskComponent } from './desk/sara-desk.component';
import { SearchComponent, HighlightPipe } from './search/search.component';
import { PasswordComponent } from './password/password.component';
import { LoginComponent, RecoveryAccountComponent, ChangePasswordComponent } from './login/';
import { MaterialComponentsModule } from './material.module';
import { ClrIconModule } from '@clr/angular';
import { HttpClientModule } from '@angular/common/http';
import { PersonComponent } from './user/person.component';
import { PersonDisplayComponent } from './user/personDisplay.component';
@NgModule({
	declarations: [
		ButtonDeskComponent,
		MenuDeskComponent,
		ChangePassDialogComponent,
		SaraDeskComponent,
		HighlightPipe,
		SearchComponent,
		PasswordComponent,
		LoginComponent,
		RecoveryAccountComponent,
		ChangePasswordComponent,
		PersonComponent,
		PersonDisplayComponent
	],
	imports: [
		CommonModule,
		MaterialComponentsModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		HttpClientModule,
		ClrIconModule
	],
	exports: [
		MaterialComponentsModule,
		ButtonDeskComponent,
		MenuDeskComponent,
		ChangePassDialogComponent,
		SaraDeskComponent,
		SearchComponent,
		LoginComponent,
		RecoveryAccountComponent,
		ChangePasswordComponent,
		ClrIconModule,
		PersonComponent,
		PersonDisplayComponent,
		HighlightPipe
	],
	providers: [],
})
export class SaraComponentsModule { }
