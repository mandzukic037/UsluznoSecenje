import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TehnickaPodrskaComponent } from './tehnicka-podrska-component';

describe('TehnickaPodrskaComponent', () => {
  let component: TehnickaPodrskaComponent;
  let fixture: ComponentFixture<TehnickaPodrskaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TehnickaPodrskaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TehnickaPodrskaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
