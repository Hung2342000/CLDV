import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CustomerRequestService } from '../service/customer-request.service';
import { ITicket } from '../../ticket/ticket.model';

@Component({
  templateUrl: './customer-request-delete-dialog.component.html',
})
export class CustomerRequestDeleteDialogComponent {
  ticket?: ITicket;

  constructor(protected ticketService: CustomerRequestService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ticketService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
