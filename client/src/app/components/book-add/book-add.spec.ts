import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAdd } from './book-add';

describe('BookAdd', () => {
  let component: BookAdd;
  let fixture: ComponentFixture<BookAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
