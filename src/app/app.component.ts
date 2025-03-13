import { Component } from '@angular/core';
import { ContentComponent } from "./content/content.component";

@Component({
    selector: 'app-root',
    imports: [ContentComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'finance-control';
}
