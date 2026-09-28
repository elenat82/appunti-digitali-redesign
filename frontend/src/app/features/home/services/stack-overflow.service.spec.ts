import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import {
  StackOverflowQuestion
} from '../../../core/models/stack-overflow-question.model';
import { StackOverflowService } from './stack-overflow.service';

describe('StackOverflowService', () => {
  let service: StackOverflowService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StackOverflowService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(
      StackOverflowService
    );

    httpTesting = TestBed.inject(
      HttpTestingController
    );
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should retrieve Stack Overflow questions', () => {
    const mockQuestions: StackOverflowQuestion[] = [
      {
        id: 12345,
        title: 'Angular question',
        url:
          'https://stackoverflow.com/questions/12345',
        tags: [
          'angular',
          'typescript'
        ],
        score: 3,
        answerCount: 2,
        isAnswered: true,
        lastActivityDate: 1234567890
      }
    ];

    service.getQuestions().subscribe(
      (questions) => {
        expect(questions).toEqual(
          mockQuestions
        );
      }
    );

    const request = httpTesting.expectOne(
      `${environment.apiBaseUrl}/api/stackoverflow`
    );

    expect(request.request.method).toBe(
      'GET'
    );

    request.flush(mockQuestions);
  });
});
