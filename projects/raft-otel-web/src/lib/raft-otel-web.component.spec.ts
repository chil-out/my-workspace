import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaftOtelWebComponent } from './raft-otel-web.component';

describe('RaftOtelWebComponent', () => {
  let component: RaftOtelWebComponent;
  let fixture: ComponentFixture<RaftOtelWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaftOtelWebComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaftOtelWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
