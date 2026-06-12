import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaserskoGraviranjeComponent } from './lasersko-graviranje-component';

describe('LaserskoGraviranjeComponent', () => {
  let component: LaserskoGraviranjeComponent;
  let fixture: ComponentFixture<LaserskoGraviranjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaserskoGraviranjeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaserskoGraviranjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
