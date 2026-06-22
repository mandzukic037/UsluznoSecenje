import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CncSavijanjeComponent } from './cnc-savijanje-component';

describe('CncSavijanjeComponent', () => {
  let component: CncSavijanjeComponent;
  let fixture: ComponentFixture<CncSavijanjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CncSavijanjeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CncSavijanjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
