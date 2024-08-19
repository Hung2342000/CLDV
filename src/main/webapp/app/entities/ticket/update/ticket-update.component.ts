import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITicket, Ticket } from '../ticket.model';
import { TicketService } from '../service/ticket.service';

@Component({
  selector: 'jhi-ticket-update',
  templateUrl: './ticket-update.component.html',
})
export class TicketUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    phone: [],
    serviceType: [],
    status: [],
    createdTime: [],
    changeBy: [],
    shopCode: [],
    closedTime: [],
    smsReceived: [],
    province: [],
    smsStatus: [],
    callingStatus: [],
    note: [],
  });

  constructor(protected ticketService: TicketService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticket }) => {
      this.updateForm(ticket);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ticket = this.createFromForm();
    if (ticket.id !== undefined) {
      this.subscribeToSaveResponse(this.ticketService.update(ticket));
    } else {
      this.subscribeToSaveResponse(this.ticketService.create(ticket));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicket>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(ticket: ITicket): void {
    this.editForm.patchValue({
      id: ticket.id,
      phone: ticket.phone,
      serviceType: ticket.serviceType,
      status: ticket.status,
      createdTime: ticket.createdTime,
      changeBy: ticket.changeBy,
      shopCode: ticket.shopCode,
      closedTime: ticket.closedTime,
      smsReceived: ticket.smsReceived,
      province: ticket.province,
      smsStatus: ticket.smsStatus,
      callingStatus: ticket.callingStatus,
      note: ticket.note,
    });
  }

  protected createFromForm(): ITicket {
    return {
      ...new Ticket(),
      id: this.editForm.get(['id'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      serviceType: this.editForm.get(['serviceType'])!.value,
      status: this.editForm.get(['status'])!.value,
      createdTime: this.editForm.get(['createdTime'])!.value,
      changeBy: this.editForm.get(['changeBy'])!.value,
      shopCode: this.editForm.get(['shopCode'])!.value,
      closedTime: this.editForm.get(['closedTime'])!.value,
      smsReceived: this.editForm.get(['smsReceived'])!.value,
      province: this.editForm.get(['province'])!.value,
      smsStatus: this.editForm.get(['smsStatus'])!.value,
      callingStatus: this.editForm.get(['callingStatus'])!.value,
      note: this.editForm.get(['note'])!.value,
    };
  }
}
