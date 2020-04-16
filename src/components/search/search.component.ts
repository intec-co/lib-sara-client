import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { PipeTransform, Pipe } from '@angular/core';
import { TransactionsService } from '../../services';

export interface OptionSearch {
	title: string;
	value: string;
}
@Component({
	selector: 'search-person',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css'],
})
export class SearchComponent {
	mobileQuery: MediaQueryList;
	toHighlight: string;
	@Input() set menu(array: Array<OptionSearch>) {
		if (array.length) {
			this.options = array;
			this.placeholder = `Buscar ${this.options[0].title}`;
		}
	}
	@Output() setOption = new EventEmitter<any>();
	@Output() selectPerson = new EventEmitter<any>();

	searchControl: FormControl;
	filteredResults: Observable<any>;
	options: Array<OptionSearch>;
	placeholder = 'Buscar Persona';

	constructor(
		private post: TransactionsService
	) {
		this.searchControl = new FormControl();
		this.filteredResults = this.searchControl.valueChanges.pipe(
			debounceTime(250),
			distinctUntilChanged(),
			map(term => {
				this.toHighlight = term;
				return term;
			}),
			switchMap(term =>
				term.length < 5 ? of([]) :
					this.post.readList('person', {
						$or: [{ docId: { $regex: term, $options: 'i' } },
						{ name: { $regex: term, $options: 'i' } },
						{ email: { $regex: term, $options: 'i' } }]
					},
						{
							limit: 10,
							project: { id: 1, docId: 1, name: 1 }
						})
			)
		);
	}
	emitOption(i) {
		this.placeholder = `Buscar ${this.options[i].title}`;
		this.setOption.emit(this.options[i].value);
	}
	selected($event) {
		this.selectPerson.emit($event.option.value);
		this.searchControl.reset('');
	}

	displayFn(person): string | undefined {
		return person ? person.name : undefined;
	}
}

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
	transform(text: string, search): string {
		const pattern = search
			.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
			.split(' ')
			.filter(t => t.length > 0)
			.join('|');
		const regex = new RegExp(pattern, 'gi');

		return search ? text.replace(regex, match => `<b>${match}</b>`) : text;
	}
}
