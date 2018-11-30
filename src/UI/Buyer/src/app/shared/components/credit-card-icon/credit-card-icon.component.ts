import { Component, OnInit, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import {
  faCcVisa,
  faCcMastercard,
  faCcDiscover,
} from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'shared-credit-card-icon',
  templateUrl: './credit-card-icon.component.html',
  styleUrls: ['./credit-card-icon.component.scss'],
})
export class CreditCardIconComponent implements OnInit {
  cardIcon: IconDefinition;

  @Input() cardType: string;
  @Input() size: string;

  ngOnInit() {
    this.cardIcon = this.setCardIcon();
  }

  setCardIcon(): IconDefinition {
    switch (this.cardType.toLowerCase()) {
      case 'visa':
        return faCcVisa;
      case 'mastercard':
        return faCcMastercard;
      case 'discover':
        return faCcDiscover;
    }
  }
}
