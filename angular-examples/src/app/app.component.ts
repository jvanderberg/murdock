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
	@Output() items = countries;
	@Output() selectedItem: Country | null = null;

	@Output() itemToString = (item: Country): string => {
		return item?.name?.common;
	};
}
