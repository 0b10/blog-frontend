import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPostsComponent } from './no-posts.component';

describe('NoPostsComponent', () => {
  let component: NoPostsComponent;
  let fixture: ComponentFixture<NoPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
