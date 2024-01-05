import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
	selector: 'app-child',
	styles: `.btn { padding: 5px; }`,
	template: `
		<p>🐢 all the way down {{ items.length }}</p>
		<button class="btn" (click)="addItem()">Add Item</button>
	`,
	standalone: true
})
export class ChildComponent {
	@Input() items: string[] = [];
	@Output() addItemEvent = new EventEmitter<string>();

	addItem() {
		this.addItemEvent.emit('🐢');
	}
}
