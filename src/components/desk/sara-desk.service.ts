import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SaraDeskService {
	private toggle = new Subject<boolean>();
	toggle$ = this.toggle.asObservable();

	menu(state: boolean) {
		this.toggle.next(state);
	}
}
