import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppFormErrorService } from '@app-buyer/shared/services/form-error/form-error.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  faCcVisa,
  faCcMastercard,
  faCcDiscover,
} from '@fortawesome/free-brands-svg-icons';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthorizeNetService } from '@app-buyer/shared/services/authorize-net/authorize-net.service';
import { AuthNetCreditCard } from '@app-buyer/shared/services/authorize-net/authnet-credit-card.interface';

@Component({
  selector: 'shared-credit-card-form',
  templateUrl: './credit-card-form.component.html',
  styleUrls: ['./credit-card-form.component.scss'],
})
export class CreditCardFormComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService,
    private authorizeNetService: AuthorizeNetService
  ) {}
  faCcVisa = faCcVisa;
  faCcMastercard = faCcMastercard;
  faCcDiscover = faCcDiscover;
  faCheck = faCheck;
  faTimes = faTimes;
  faPlus = faPlus;

  @Input()
  set card(card: AuthNetCreditCard) {
    this.existingCard = card || {};
    if (card) {
      this.cardType = card.CardType;
    }
    this.ngOnInit();
  }
  @Input() submitText: string;
  @Output() formSubmitted = new EventEmitter<AuthNetCreditCard>();
  private existingCard: AuthNetCreditCard = null;
  cardForm: FormGroup;
  yearOptions: string[];
  monthOptions: string[];
  cardType: string;

  ngOnInit() {
    this.setAvailableCardOptions();
    this.setCardForm();
  }

  private setCardForm() {
    let expMonth = this.monthOptions[0];
    let expYear = this.yearOptions[1].slice(-2);
    if (this.existingCard.ExpirationDate) {
      [expMonth, expYear] = this.splitAt(2, this.existingCard.ExpirationDate);
    }
    this.cardForm = this.formBuilder.group({
      CardNumber: [
        '',
        Validators.required,
        this.authorizeNetService.validateCardNumberFormControl.bind(
          this.authorizeNetService
        ),
      ],
      CardholderName: [
        this.existingCard.CardholderName || '',
        Validators.required,
      ],
      expMonth: [expMonth, Validators.required],
      expYear: [expYear, Validators.required],
      CardCode: [this.existingCard.CardCode || '', Validators.required],
    });
  }

  handleCardNumberChange($event) {
    const cardNumber = $event.target.value;
    this.cardType = this.authorizeNetService.getCardType(cardNumber);
  }

  onSubmit() {
    if (this.cardForm.status === 'INVALID') {
      this.formErrorService.displayFormErrors(this.cardForm);
      return;
    }

    const card = {
      ...this.cardForm.value,
      ExpirationDate: `${this.cardForm.value.expMonth}${
        this.cardForm.value.expYear
      }`,
      CardType: this.authorizeNetService.getCardType(
        this.cardForm.value.CardNumber
      ),
    };

    this.formSubmitted.emit(card);
  }

  handleYearChange($event) {
    const prevMonthValue = this.cardForm.value.expMonth;
    this.monthOptions = this.getArrayOfFutureMonthsForYear($event.target.value);

    // handles cases where the year is set to future years and then reset to the current year where the current month is not selectable
    // i.e. if it is Sept 2018, the user has March 2020 selected, the user resets to 2018, this resets the month to Sept.
    if (!this.monthOptions.includes(prevMonthValue)) {
      this.cardForm.value.expMonth = this.monthOptions[0];
    }
  }

  private getArrayOfFutureMonthsForYear(year: number): string[] {
    const monthArray: string[] = [];
    const slicedYear = Number(year.toString().slice(-2));
    if (
      slicedYear >
      Number(
        new Date()
          .getFullYear()
          .toString()
          .slice(-2)
      )
    ) {
      for (let i = 1; i <= 12; i++) {
        monthArray.push(`0${i}`.slice(-2));
      }
    } else {
      for (let i = new Date().getMonth() + 1; i <= 12; i++) {
        const a = `0${i}`;
        monthArray.push(a.slice(-2));
      }
    }
    return monthArray;
  }

  private setAvailableCardOptions() {
    const currentYear = new Date().getFullYear();
    this.yearOptions = Array(20)
      .fill(0)
      .map((_x, i) => `${i + currentYear}`);
    const currentlySelectedYear = this.existingCard.ExpirationDate
      ? parseInt(this.existingCard.ExpirationDate.substring(2, 4), 10)
      : currentYear + 1; //sets the default year to one after the current year if there is none provided by the checkout state
    this.monthOptions = this.getArrayOfFutureMonthsForYear(
      currentlySelectedYear
    );
  }

  // control display of required error messages
  protected hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.cardForm);
  protected hasInvalidCreditCardNumber = (controlName: string) =>
    this.formErrorService.hasInvalidCreditCardNumber(
      controlName,
      this.cardForm
    );
  protected hasInvalidCreditCardType = (controlName: string) =>
    this.formErrorService.hasInvalidCreditCardType(controlName, this.cardForm);

  /**
   * Helper function for spliting a string into an array with two elements at an index.
   */
  private splitAt = (index, string) => [
    string.slice(0, index),
    string.slice(index),
  ];
}
