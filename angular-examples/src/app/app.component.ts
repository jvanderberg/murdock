import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SelectComponent } from '@murdock-ui/murdock-angular';
import { countries } from './countries';
export type Country = {
	name: {
		common: string;
	};
};
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const searchFunction = async (value: string, abortController: AbortController): Promise<Country[]> => {
	const results = await fetch('https://restcountries.com/v3.1/name/' + value, { signal: abortController.signal });
	await wait(500);
	if (abortController.signal.aborted) {
		throw new Error('Aborted');
	}
	return await results.json();
};
@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CommonModule, RouterOutlet, SelectComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'murdock-angular';
	@Output() search = '';
	@Output() searchFunction = searchFunction;
	@Output() selectedItem: Country | null = null;

	@Output() itemToString = (item: Country): string => {
		return item?.name?.common;
	};
}
