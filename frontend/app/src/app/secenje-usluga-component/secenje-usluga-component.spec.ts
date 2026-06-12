import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecenjeUslugaComponent } from './secenje-usluga-component';

describe('SecenjeUslugaComponent', () => {
  let component: SecenjeUslugaComponent;
  let fixture: ComponentFixture<SecenjeUslugaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecenjeUslugaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecenjeUslugaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
