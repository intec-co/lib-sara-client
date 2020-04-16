import { Subject, Observable } from 'rxjs';

import { ClarityIcons } from '@clr/icons';
import { ClrShapeLogout } from '@clr/icons/shapes/essential-shapes';

import { SessionService, RoutesService } from '../services';

export abstract class AppClient {
	protected loadSubject: Subject<boolean>;

	constructor(
		protected session: SessionService,
		protected routesService: RoutesService,
		private preload: Array<() => Observable<any>>
	) {
		ClarityIcons.add({
			logout: ClrShapeLogout
		});
		this.loadSubject = new Subject<boolean>();
		this.session.preload = this.preload;
		this.session.registerProcessRoles(this._processRoles);
	}

	abstract processRoles: () => void;

	_processRoles = () => {
		this.processRoles();
		this.routesService.completed();
	}
}
