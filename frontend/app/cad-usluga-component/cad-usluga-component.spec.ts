import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadUslugaComponent } from './cad-usluga-component';

describe('CadUslugaComponent', () => {
  let component: CadUslugaComponent;
  let fixture: ComponentFixture<CadUslugaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadUslugaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadUslugaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
