import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpitComponent } from './upit-component';
import { HttpClient } from '@angular/common/http';

describe('UpitComponent', () => {
  let component: UpitComponent;
  let fixture: ComponentFixture<UpitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
