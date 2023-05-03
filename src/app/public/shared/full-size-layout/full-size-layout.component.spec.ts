import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullSizeLayoutComponent } from './full-size-layout.component';

describe('FullSizeLayoutComponent', () => {
  let component: FullSizeLayoutComponent;
  let fixture: ComponentFixture<FullSizeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullSizeLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullSizeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
