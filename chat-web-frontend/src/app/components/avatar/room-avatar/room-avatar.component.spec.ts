import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAvatarComponent } from './room-avatar.component';

describe('RoomAvatarComponent', () => {
  let component: RoomAvatarComponent;
  let fixture: ComponentFixture<RoomAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
