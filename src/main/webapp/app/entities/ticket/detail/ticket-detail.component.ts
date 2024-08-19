import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ITicket } from '../ticket.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-ticket-detail',
  templateUrl: './ticket-detail.component.html',
})
export class TicketDetailComponent {
  ticket: ITicket | null = null;

  constructor(protected activatedRoute: ActivatedRoute,
  protected activeModal: NgbActiveModal,
  protected router: Router,) {}

  // ngOnInit(): void {
  //   this.activatedRoute.data.subscribe(({ ticket }) => {
  //     this.ticket = ticket;
  //   });
  // }

  previousState(): void {
    this.activeModal.dismiss();
  }
  edit(ticket: ITicket): void {
    this.router.navigate(['/ticket', ticket.id, 'edit']);
    this.activeModal.dismiss();
  }
}
