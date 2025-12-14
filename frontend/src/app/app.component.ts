import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // Necesario para router-outlet
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}
