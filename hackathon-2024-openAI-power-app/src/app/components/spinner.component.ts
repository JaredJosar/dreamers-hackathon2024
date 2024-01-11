import { Component } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-spinner',
  template: `
    <div *ngIf="isLoading$ | async" class="spinner-overlay">
      <!-- Add your spinner implementation here -->
      Loading...
    </div>
  `,
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent {
  isLoading$ = this.spinnerService.isLoading$;

  constructor(private spinnerService: SpinnerService) { }
}
