import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { App } from './app';
import { AreasService } from './features/areas/data-access/areas.service';

describe('App', () => {
  const areasServiceMock = {
    getAreas: () => of([
      {
        id: 'html',
        label: 'HTML',
        iconUrl: 'https://example.com/html.svg',
        weight: 0
      },
      {
        id: 'css',
        label: 'CSS',
        iconUrl: 'https://example.com/css.svg',
        weight: 1
      }
    ])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: AreasService,
          useValue: areasServiceMock
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('should render the title', async () => {
    const fixture = TestBed.createComponent(App);

    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Appunti Digitali'
    );
  });

  it('should render the thematic areas', async () => {
    const fixture = TestBed.createComponent(App);

    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('li');

    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('HTML');
    expect(items[1].textContent).toContain('CSS');
  });
});
