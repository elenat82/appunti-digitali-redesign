import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Area } from '../../../core/models/area.model';
import { Article } from '../../../core/models/article.model';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  let fixture: ComponentFixture<Sidebar>;

  const areas: Area[] = [
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
  ];

  const articlesByArea: Record<string, Article[]> = {
    html: [
      {
        id: 1,
        title: 'Articolo HTML',
        path: '/html/articolo-html',
        area: 'html',
        body: '<p>HTML</p>',
        externalLinks: [],
        weight: 0
      }
    ],
    css: [
      {
        id: 2,
        title: 'Articolo CSS',
        path: '/css/articolo-css',
        area: 'css',
        body: '<p>CSS</p>',
        externalLinks: [],
        weight: 0
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);

    fixture.componentRef.setInput(
      'areas',
      areas
    );

    fixture.componentRef.setInput(
      'articlesByArea',
      articlesByArea
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra tutte le aree con le relative icone', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const summaries =
      element.querySelectorAll('summary');

    const icons =
      element.querySelectorAll('summary img');

    expect(summaries).toHaveLength(2);
    expect(icons).toHaveLength(2);

    expect(summaries[0].textContent).toContain(
      'HTML'
    );

    expect(summaries[1].textContent).toContain(
      'CSS'
    );

    expect(
      icons[0].getAttribute('src')
    ).toBe('https://example.com/html.svg');

    expect(
      icons[1].getAttribute('src')
    ).toBe('https://example.com/css.svg');
  });

  it('mostra gli articoli associati alle aree', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const links =
      element.querySelectorAll(
        'nav li a'
      );

    expect(links).toHaveLength(2);

    expect(links[0].textContent).toContain(
      'Articolo HTML'
    );

    expect(links[1].textContent).toContain(
      'Articolo CSS'
    );
  });

  it('usa il path dell\'articolo per la navigazione', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const links =
      element.querySelectorAll<HTMLAnchorElement>(
        'nav li a'
      );

    expect(
      links[0].getAttribute('href')
    ).toBe('/html/articolo-html');

    expect(
      links[1].getAttribute('href')
    ).toBe('/css/articolo-css');
  });

  it('chiude la sidebar tramite il pulsante di toggle', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const button =
      element.querySelector<HTMLButtonElement>(
        '.sidebar-toggle'
      );

    button?.click();
    fixture.detectChanges();

    expect(
      fixture.componentInstance.isOpen()
    ).toBe(false);

    expect(
      element
        .querySelector('.sidebar')
        ?.classList
        .contains('sidebar--collapsed')
    ).toBe(true);

    expect(
      button?.getAttribute('aria-expanded')
    ).toBe('false');
  });

  it('mantiene visibili le icone quando la sidebar è chiusa', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const button =
      element.querySelector<HTMLButtonElement>(
        '.sidebar-toggle'
      );

    button?.click();
    fixture.detectChanges();

    const icons =
      element.querySelectorAll('summary img');

    expect(icons).toHaveLength(2);
  });

  it('nasconde nomi delle aree e articoli quando la sidebar è chiusa', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const button =
      element.querySelector<HTMLButtonElement>(
        '.sidebar-toggle'
      );

    button?.click();
    fixture.detectChanges();

    expect(
      element.querySelectorAll('summary span')
    ).toHaveLength(0);

    expect(
      element.querySelectorAll('nav ul')
    ).toHaveLength(0);
  });

  it('ripristina il contenuto quando la sidebar viene riaperta', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const button =
      element.querySelector<HTMLButtonElement>(
        '.sidebar-toggle'
      );

    button?.click();
    fixture.detectChanges();

    button?.click();
    fixture.detectChanges();

    expect(
      fixture.componentInstance.isOpen()
    ).toBe(true);

    expect(
      element.querySelectorAll('summary span')
    ).toHaveLength(2);

    expect(
      element.querySelectorAll('nav li a')
    ).toHaveLength(2);

    expect(
      button?.getAttribute('aria-expanded')
    ).toBe('true');
  });
});
