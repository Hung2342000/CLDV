import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { CustomerRequestService } from '../service/customer-request.service';
import { CustomerRequestDeleteDialogComponent } from '../delete/customer-request-delete-dialog.component';
import { CustomerRequestDetailComponent } from '../detail/customer-request-detail.component';
import { ITicket } from '../../ticket/ticket.model';
import { finalize } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from '../../../config/input.constants';

@Component({
  selector: 'jhi-customer-request',
  templateUrl: './customer-request.component.html',
})
export class CustomerRequestComponent implements OnInit {
  @ViewChild('content') content: TemplateRef<any> | undefined;
  tickets?: ITicket[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  ticket?: ITicket | any;
  modalContent?: string = '';
  isSaving = false;
  searchPhone?: string = '';
  searchService?: string = '';
  searchProvince?: string = '';
  searchTime?: dayjs.Dayjs;
  constructor(
    protected ticketService: CustomerRequestService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.ticketService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        searchPhone: this.searchPhone,
        searchService: this.searchService,
        searchTime: this.searchTime?.isValid() ? this.searchTime.format(DATE_FORMAT) : null,
        searchProvince: this.searchProvince,
      })
      .subscribe({
        next: (res: HttpResponse<ITicket[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  view(ticket: ITicket): void {
    const modalRef = this.modalService.open(CustomerRequestDetailComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ticket = ticket;
  }

  closeCustomerRequest(ticket: ITicket): void {
    if (ticket.id !== undefined) {
      this.ticket = Object.assign({}, ticket);
      this.ticket.status = 'Đã đóng';
      this.subscribeToSaveResponse(this.ticketService.updateClose(this.ticket));
    }
  }
  loadPageSearch(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    this.ticketService
      .query({
        page: 0,
        size: this.itemsPerPage,
        sort: this.sort(),
        searchPhone: this.searchPhone,
        searchService: this.searchService,
        searchTime: this.searchTime?.isValid() ? this.searchTime.format(DATE_FORMAT) : null,
        searchProvince: this.searchProvince,
      })
      .subscribe({
        next: (res: HttpResponse<ITicket[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, 1, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }
  onDateChange(): void {
    this.loadPageSearch();
  }
  newArr(lenght: number): any[] {
    if (lenght > 0) {
      return new Array(lenght);
    } else {
      return new Array(0);
    }
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(_index: number, item: ITicket): number {
    return item.id!;
  }

  delete(ticket: ITicket): void {
    const modalRef = this.modalService.open(CustomerRequestDeleteDialogComponent, { size: 'sm', backdrop: 'static' });
    modalRef.componentInstance.ticket = ticket;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    location.reload();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicket>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: (res: HttpResponse<ITicket>) => {
        this.ticket = res.body;
        if (this.ticket.id === null) {
          this.modalContent = 'Đóng yêu cầu không thành công!';
          this.modalService.open(this.content, { size: 'md', backdrop: 'static' });
        } else {
          this.modalContent = 'Đóng yêu cầu thành công!';
          this.modalService.open(this.content, { size: 'md', backdrop: 'static' });
        }
      },
    });
  }
  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: ITicket[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/customer-request'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.tickets = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
