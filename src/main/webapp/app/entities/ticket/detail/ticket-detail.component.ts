import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ITicket } from '../ticket.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IDepartment } from '../department.model';

@Component({
  selector: 'jhi-ticket-detail',
  templateUrl: './ticket-detail.component.html',
})
export class TicketDetailComponent {
  ticket: ITicket | null = null;
  departments?: IDepartment[] | any;

  constructor(protected activatedRoute: ActivatedRoute, protected activeModal: NgbActiveModal, protected router: Router) {}

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
  departmentName(code: string | null | undefined): any {
    let name = code;
    for (let i = 0; i < this.departments.length; i++) {
      if (code?.includes(this.departments[i].code)) {
        name = this.departments[i].province;
      }
    }
    return name;
  }
}
