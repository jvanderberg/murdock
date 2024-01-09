import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SelectComponent } from 'murdock-angular';

export type Country = {
	name: {
		common: string;
	};
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
	@Output() selectedItem: Country | null = null;
	@Output() searchFunc = async (value: string, abortController: AbortController): Promise<Country[]> => {
		const results = await fetch('https://restcountries.com/v3.1/name/' + value, {
			signal: abortController.signal
		});

		if (abortController.signal.aborted) {
			throw new Error('Aborted');
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return await results.json();
	};
	@Output() itemToString = (item: Country): string => {
		return item?.name?.common;
	};
}
