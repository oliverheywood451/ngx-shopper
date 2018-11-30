import { Component, OnInit } from '@angular/core';
import {
  OcMeService,
  BuyerCreditCard,
  ListSpendingAccount,
} from '@ordercloud/angular-sdk';
import { Observable } from 'rxjs';
import { faPlus, faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import {
  AuthorizeNetService,
  CreateCardDetails,
  ModalService,
} from '@app-buyer/shared';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { partition as _partition } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'profile-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
})
export class PaymentListComponent implements OnInit {
  alive = true;
  faPlus = faPlus;
  faArrowLeft = faArrowLeft;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  personalCards: BuyerCreditCard[] = [];
  assignedCards: BuyerCreditCard[] = [];
  accounts$: Observable<ListSpendingAccount>;
  currentCard: BuyerCreditCard = null;
  modalID = 'AddOrEditCreditCard';

  constructor(
    private ocMeService: OcMeService,
    private authorizeNetSerivce: AuthorizeNetService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.getCards();
    this.getAccounts();
  }

  getCards() {
    this.ocMeService.ListCreditCards().subscribe((res) => {
      [this.personalCards, this.assignedCards] = _partition(
        res.Items,
        (card) => card.Editable
      );
    });
  }

  getAccounts() {
    const now = moment().format('YYYY-MM-DD');
    const dateFilter = { StartDate: `>${now}|!*`, EndDate: `<${now}|!*` };
    this.accounts$ = this.ocMeService.ListSpendingAccounts({
      filters: dateFilter,
    });
  }

  openEditCard(card: BuyerCreditCard) {
    this.currentCard = card;
    this.modalService.open(this.modalID);
  }

  openAddCard() {
    this.currentCard = null;
    this.modalService.open(this.modalID);
  }

  addCard(card: CreateCardDetails) {
    this.authorizeNetSerivce.CreateCreditCard(card).subscribe(() => {
      this.modalService.close(this.modalID);
      this.getCards();
    });
  }

  deleteCard(cardId: string) {
    this.authorizeNetSerivce.DeleteCreditCard(cardId).subscribe(() => {
      this.getCards();
    });
  }

  editCard(card: CreateCardDetails) {
    this.authorizeNetSerivce.EditCreditCard(card).subscribe(() => {
      this.currentCard = null;
      this.modalService.close(this.modalID);
      this.getCards();
    });
  }
}
