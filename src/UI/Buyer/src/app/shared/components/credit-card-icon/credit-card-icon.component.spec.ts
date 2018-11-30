import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faCcVisa,
  faCcMastercard,
  faCcDiscover,
} from '@fortawesome/free-brands-svg-icons';
import { CreditCardIconComponent } from '@app/shared/components/credit-card-icon/credit-card-icon.component';

describe('CreditCardIconComponent', () => {
  let component: CreditCardIconComponent;
  let fixture: ComponentFixture<CreditCardIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FaIconComponent, CreditCardIconComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardIconComponent);
    component = fixture.componentInstance;
    component.cardType = 'Visa';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'setCardIcon');
      component.ngOnInit();
    });
    it('should call setCardIcon', () => {
      expect(component.setCardIcon).toHaveBeenCalled();
    });
  });

  describe('setCardIcon', () => {
    it('should handle visa', () => {
      component.cardType = 'Visa';
      const icon = component.setCardIcon();
      expect(icon).toBe(faCcVisa);
    });
    it('should handle mastercard', () => {
      component.cardType = 'MasterCard';
      const icon = component.setCardIcon();
      expect(icon).toBe(faCcMastercard);
    });
    it('should handle discover', () => {
      component.cardType = 'Discover';
      const icon = component.setCardIcon();
      expect(icon).toBe(faCcDiscover);
    });
  });
});
