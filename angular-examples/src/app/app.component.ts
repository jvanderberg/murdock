import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SelectComponent } from '@murdock-ui/murdock-angular';
import { faker } from '@faker-js/faker';

export type Country = {
	name: {
		common: string;
	};
};
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Animal = {
	id: number;
	name: string;
};

const search =
	(latency: number) =>
	async (value: string, abortController: AbortController): Promise<Country[]> => {
		const results = await fetch('https://restcountries.com/v3.1/name/' + value, { signal: abortController.signal });
		await wait(latency);
		if (abortController.signal.aborted) {
			throw new Error('Aborted');
		}
		return await results.json();
	};

const fakerFuncs = [
	faker.animal.bear,
	faker.animal.cat,
	faker.animal.dog,
	faker.animal.type,
	faker.animal.fish,
	faker.animal.lion,
	faker.animal.snake,
	faker.animal.cetacean,
	faker.animal.cow,
	faker.animal.horse,
	faker.animal.insect,
	faker.animal.rabbit
];

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
	latency = 300;
	searchFunction = search(this.latency);
	@Output() selectedItem: Country | null = null;
	@Output() selectedAnimal: Animal | null = null;
	searchValue: string = '';
	placeholderCountries: string = 'Search for a country';
	placeholderAnimals = 'Search for an animal';

	limit = 10;
	debounce = 50;
	disabled = false;
	width = 300;
	height = 40;
	popupHeight = 300;
	cornerRadius = 4;
	textColor = '#000000';
	primaryColor = '#646cff';
	backgroundColor = '#ffffff';
	padding = 8;
	font = '20px Arial, sans-serif';
	fetchLatency = this.latency;
	staticDataSize = 300;
	dynamicSearch = true;
	animationSpeed = 300;
	@Output() staticData: Animal[] = this.getStaticData(this.staticDataSize);

	itemToString = (item: Country | null): string => {
		return item?.name.common ?? '';
	};
	animalToString = (animal: Animal | null): string => animal?.name ?? '';
	setDataTypeAnimal() {
		this.dynamicSearch = false;
	}
	setDataTypeCountry() {
		this.dynamicSearch = true;
	}
	getStaticData(length: number): Animal[] {
		// Generate length animal names
		const animals: Set<string> = new Set();
		let loops = 0;
		while (animals.size < length && loops < 1000) {
			const name = fakerFuncs[Math.floor(Math.random() * fakerFuncs.length)]();

			animals.add(name[0].toUpperCase() + name.slice(1));
			loops++;
		}
		return Array.from(animals).map((name, index) => ({ id: index, name }));
	}

	setStaticDataSize(event: Event) {
		const target = event.target as HTMLInputElement;
		const size = parseInt(target.value, 10);
		this.staticDataSize = size;
		this.staticData = this.getStaticData(size);
	}
	setFetchLatency(event: Event) {
		const target = event.target as HTMLInputElement;
		const latency = parseInt(target.value, 10);
		this.fetchLatency = latency;
		this.searchFunction = search(latency);
	}
}
