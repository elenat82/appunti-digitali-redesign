import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { LoadingIndicator } from './loading-indicator';

describe('LoadingIndicator', () => {
  let fixture:
    ComponentFixture<LoadingIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingIndicator]
    }).compileComponents();

    fixture =
      TestBed.createComponent(
        LoadingIndicator
      );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(
      fixture.componentInstance
    ).toBeTruthy();
  });

  it('exposes the loading state to assistive technologies', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const status =
      element.querySelector<HTMLElement>(
        '[role="status"]'
      );

    expect(status?.textContent).toContain(
      'Caricamento in corso'
    );
  });
});
