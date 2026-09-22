import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { AreasService } from './features/areas/data-access/areas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly areasService = inject(AreasService);

  protected readonly areas = toSignal(
    this.areasService.getAreas(),
    { initialValue: [] }
  );
}
