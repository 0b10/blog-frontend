import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingPostsComponent } from './loading.component';

describe('LoadingPostsComponent', () => {
  let component: LoadingPostsComponent;
  let fixture: ComponentFixture<LoadingPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingPostsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
