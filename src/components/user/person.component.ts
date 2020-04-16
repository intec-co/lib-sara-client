import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { TransactionsService } from '../../services';
// import { Person } from './interface';

interface Person {
	id: number;
	docIdType: string;
	cellphone: string;
}

@Component({
	selector: 'person',
	templateUrl: './person.component.html',
	styleUrls: ['./person.component.scss']
})
export class PersonComponent implements AfterViewInit {
	@Input() set data(value: Person) {
		this.personId = value.id;
		this.personData = value;
		this.setForm(value);
	}
	@Input() buttonSave = true;
	@Output() getData = new EventEmitter<any>();

	personData;
	personForm: FormGroup;
	docIdType = 'CC';
	personId: number;
	enableSave = true;
	subscriptionRouter;

	constructor(
		private post: TransactionsService,
		private router: Router,
		private route: ActivatedRoute,
		private _formBuilder: FormBuilder
	) {
		this.personForm = this._formBuilder.group({
			id: -1,
			docId: ['', Validators.required],
			givenName: ['', Validators.required],
			givenNameSecond: [''],
			familyName: ['', Validators.required],
			familyNameSecond: [''],
			email: [''],
			phone: '',
			cellphone: '',
		});
	}
	ngAfterViewInit() {
		if (!this.personData) {
			this.route.paramMap.subscribe((params: ParamMap) => this.loadData(params.get('id')));
		}
	}
	loadData(personId) {
		this.personId = null;
		if (personId) {
			this.personId = +personId;
			this.post.read('person', { id: this.personId })
				.subscribe((res: Person) => {
					this.setForm(res);
					if (res.docIdType) {
						this.docIdType = res.docIdType;
					}
					this.getData.emit(res);
				});
		} else {
			this.personForm.reset();
		}
	}
	setForm(person: Person) {
		const data: any = person;
		if (!person.cellphone && data.celphone) {
			person.cellphone = data.celphone;
		}
		this.personForm.patchValue(person);
	}
	save() {
		if (this.enableSave) {
			this.enableSave = false;
			const data = this.personForm.value;
			let name = data.givenName;
			if (data.givenNameSecond) {
				name += ` ${data.givenNameSecond}`;
			}
			name += ` ${data.familyName}`;
			if (data.familyNameSecond) {
				name += ` ${data.familyNameSecond}`;
			}
			data.name = name;
			if (this.personId) {
				data.id = this.personId;
			}
			data.docIdType = this.docIdType;
			this.post.write('person', data).subscribe(res => {
				if (res && res.id) {
					this.router.navigate(['./', res.id], { relativeTo: this.route });
					this.enableSave = true;
				}
			});
		}
	}
	verifyDocId() {
		this.post.read('person', { docId: this.personForm.value.docId })
			.subscribe(res => {
				if (res) {
					if (this.personId) {
						this.router.navigate([`../`, res.id], { relativeTo: this.route });
					} else {
						this.router.navigate(['./', res.id], { relativeTo: this.route });
					}
				}
			});
	}
	selectDocIdType(type) {
		this.docIdType = type;
	}
}
