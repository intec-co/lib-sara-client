import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TransactionsService } from '../../services';

@Component({
	selector: 'person-display',
	templateUrl: './personDisplay.component.html',
	styleUrls: ['./personDisplay.component.scss']
})
export class PersonDisplayComponent implements OnInit {
	@Input() set data(value) {
		if (value) {
			this.personId = value.id;
			this.personData = value;
			this.personForm.patchValue(value);
		} else {
			this.personData = {};
		}
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
			phone: [''],
			cellphone: '',
		});
	}
	ngOnInit() {
		if (this.personData) {
			this.personForm.patchValue(this.personData);
			this.personId = this.personData.id;
		} else {
			this.route.paramMap.subscribe((params: ParamMap) => this.loadData(params.get('id')));
		}
	}
	loadData(personId) {
		this.personId = null;
		if (personId) {
			this.personId = +personId;
			this.post.read('person', { id: this.personId })
				.subscribe(res => {
					this.personForm.patchValue(res);
					if (res.docIdType) {
						this.docIdType = res.docIdType;
					}
					this.getData.emit(res);
				});
		} else {
			this.personForm.reset();
		}
	}
}
