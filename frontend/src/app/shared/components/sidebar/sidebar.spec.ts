import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  provideRouter,
  Router
} from '@angular/router';

import { Area } from '../../../core/models/area.model';
import { Article } from '../../../core/models/article.model';
import { Sidebar } from './sidebar';

@Component({
  selector: 'app-test-page',
  template: ''
})
class TestPage { }

describe('Sidebar', () => {
  let fixture: ComponentFixture<Sidebar>;

  let router: Router;

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
    vi.spyOn(
      HTMLMediaElement.prototype,
      'play'
    ).mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        provideRouter([
          {
            path: '**',
            component: TestPage
          }
        ])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

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

  afterEach(() => {
    vi.restoreAllMocks();
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
      summaries[0].hasAttribute(
        'data-tooltip'
      )
    ).toBe(false);

    expect(
      summaries[1].hasAttribute(
        'data-tooltip'
      )
    ).toBe(false);

    expect(
      icons[0].getAttribute('src')
    ).toBe('https://example.com/html.svg');

    expect(
      icons[1].getAttribute('src')
    ).toBe('https://example.com/css.svg');
  });

  it('evidenzia l\'area associata all\'articolo corrente', async () => {
    await router.navigateByUrl(
      '/html/articolo-html'
    );

    fixture.detectChanges();

    const activeArea: HTMLElement | null =
      fixture.nativeElement.querySelector(
        '.sidebar-area--active'
      );

    expect(activeArea).toBeTruthy();

    expect(
      activeArea?.querySelector('summary')
        ?.textContent
    ).toContain('HTML');
  });

  it('mantiene evidenziata l\'area corrente quando la sidebar è chiusa', async () => {
    await router.navigateByUrl(
      '/css/articolo-css'
      + '?source=body&index=0&start=0&end=3'
    );

    fixture.detectChanges();

    const button: HTMLButtonElement | null =
      fixture.nativeElement.querySelector(
        '.sidebar-toggle'
      );

    button?.click();
    fixture.detectChanges();

    const activeArea: HTMLElement | null =
      fixture.nativeElement.querySelector(
        '.sidebar-area--active'
      );

    expect(activeArea).toBeTruthy();

    expect(
      activeArea
        ?.querySelector('img')
        ?.getAttribute('src')
    ).toBe('https://example.com/css.svg');

    expect(
      activeArea?.querySelector('summary span')
    ).toBeNull();
  });

  it('non evidenzia nessuna area fuori da una pagina articolo', async () => {
    await router.navigateByUrl('/');

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll(
        '.sidebar-area--active'
      )
    ).toHaveLength(0);
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

    expect(
      button?.getAttribute('aria-label')
    ).toBe('Apri barra laterale');

    expect(
      button?.getAttribute('data-tooltip')
    ).toBe('Apri barra laterale');
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

    expect(
      button?.getAttribute('aria-label')
    ).toBe('Chiudi barra laterale');

    expect(
      button?.getAttribute('data-tooltip')
    ).toBe('Chiudi barra laterale');
  });

  it('plays the closing sound when the sidebar is closed', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const button =
      element.querySelector<HTMLButtonElement>(
        '.sidebar-toggle'
      );

    button?.click();

    const playMock =
      vi.mocked(
        HTMLMediaElement.prototype.play
      );

    expect(playMock).toHaveBeenCalledOnce();

    const audio =
      playMock.mock.instances[0] as HTMLAudioElement;

    expect(audio.src).toContain(
      '/assets/sounds/sidebar-close.mp3'
    );
  });

  it('plays the opening sound when the sidebar is reopened', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const button =
      element.querySelector<HTMLButtonElement>(
        '.sidebar-toggle'
      );

    button?.click();
    button?.click();

    const playMock =
      vi.mocked(
        HTMLMediaElement.prototype.play
      );

    expect(playMock).toHaveBeenCalledTimes(2);

    const firstAudio =
      playMock.mock.instances[0] as HTMLAudioElement;

    const secondAudio =
      playMock.mock.instances[1] as HTMLAudioElement;

    expect(firstAudio.src).toContain(
      '/assets/sounds/sidebar-close.mp3'
    );

    expect(secondAudio.src).toContain(
      '/assets/sounds/sidebar-open.mp3'
    );
  });

  it('reopens the sidebar and expands the selected area when collapsed', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const toggleButton =
      element.querySelector<HTMLButtonElement>(
        '.sidebar-toggle'
      );

    toggleButton?.click();
    fixture.detectChanges();

    expect(
      fixture.componentInstance.isOpen()
    ).toBe(false);

    const details =
      element.querySelector<HTMLDetailsElement>(
        'details'
      );

    const summary =
      details?.querySelector<HTMLElement>(
        'summary'
      );

    summary?.click();
    fixture.detectChanges();

    expect(
      fixture.componentInstance.isOpen()
    ).toBe(true);

    expect(details?.open).toBe(true);

    expect(
      details?.querySelector('ul')
    ).toBeTruthy();
  });

  it('keeps area summaries accessible when the sidebar is collapsed', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const toggleButton =
      element.querySelector<HTMLButtonElement>(
        '.sidebar-toggle'
      );

    toggleButton?.click();
    fixture.detectChanges();

    const summaries =
      element.querySelectorAll<HTMLElement>(
        'summary'
      );

    expect(
      summaries[0].getAttribute(
        'aria-label'
      )
    ).toBe('HTML');

    expect(
      summaries[1].getAttribute(
        'aria-label'
      )
    ).toBe('CSS');

    expect(
      summaries[0].getAttribute(
        'data-tooltip'
      )
    ).toBe('HTML');

    expect(
      summaries[1].getAttribute(
        'data-tooltip'
      )
    ).toBe('CSS');
  });
});
