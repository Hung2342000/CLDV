import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ITicket, Ticket } from '../entities/ticket/ticket.model';
import { TicketService } from '../entities/ticket/service/ticket.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('content') content: TemplateRef<any> | undefined;
  account: Account | null = null;
  isSaving = false;
  modalContent?: string = '';
  editForm = this.fb.group({
    id: [null, [Validators.required]],
    phone: [],
    serviceType: [],
  });
  private readonly destroy$ = new Subject<void>();
  constructor(
    protected modalService: NgbModal,
    protected ticketService: TicketService,
    private accountService: AccountService,
    private router: Router,
    protected fb: FormBuilder,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  closeModal(): void {
    this.modalService.dismissAll();
    location.reload();
  }

  save(): void {
    this.isSaving = true;
    const ticket = this.createFromForm();
    this.subscribeToSaveResponse(this.ticketService.create(ticket));
  }
  previousState(): void {
    this.modalService.open(this.content, { size: 'md', backdrop: 'static' });
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicket>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }
  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
  protected onSaveSuccess(): void {
    this.previousState();
  }
  protected onSaveError(): void {
    // Api for inheritance.`
  }
  protected createFromForm(): ITicket {
    return {
      ...new Ticket(),
      id: this.editForm.get(['id'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      serviceType: this.editForm.get(['serviceType'])!.value,
    };
  }
}
