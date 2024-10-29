import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITicket } from '../ticket.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { TicketService } from '../service/ticket.service';
import { TicketDeleteDialogComponent } from '../delete/ticket-delete-dialog.component';
import { TicketDetailComponent } from '../detail/ticket-detail.component';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from '../../../config/input.constants';
import { IDepartment } from '../department.model';
import { IShop } from '../../shop/shop.model';
import { finalize } from 'rxjs/operators';
import { Account } from '../../../core/auth/account.model';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  selector: 'jhi-ticket',
  templateUrl: './ticket.component.html',
})
export class TicketComponent implements OnInit {
  @ViewChild('contentCalling') contentCalling: TemplateRef<any> | undefined;
  tickets?: ITicket[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  searchPhone?: string = '';
  searchService?: string = '';
  searchProvince?: string = '';
  searchTime?: dayjs.Dayjs;
  departments?: IDepartment[] | any;
  shops?: IShop[] | any;
  ticket?: ITicket | any;
  modalContent?: string = '';
  checkAdmin = false;
  currentAccount: Account | null = null;
  isSaving = false;
  constructor(
    protected ticketService: TicketService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    private accountService: AccountService
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
    this.ticketService.queryDepartment().subscribe({
      next: (res: HttpResponse<IDepartment[]>) => {
        this.departments = res.body;
      },
    });
    this.ticketService.queryShop().subscribe({
      next: (res: HttpResponse<IShop[]>) => {
        this.shops = res.body;
      },
    });
  }

  view(ticket: ITicket): void {
    const modalRef = this.modalService.open(TicketDetailComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ticket = ticket;
    modalRef.componentInstance.departments = this.departments;
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
  newArr(lenght: number): any[] {
    if (lenght > 0) {
      return new Array(lenght);
    } else {
      return new Array(0);
    }
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

  closeCalling(ticket: ITicket): void {
    if (ticket.id !== undefined) {
      ticket = Object.assign({}, ticket);
      ticket.callingStatus = 'Đã gọi';
      this.subscribeToSaveResponse(this.ticketService.update(ticket));
    }
  }

  shopName(code: string | null | undefined): any {
    let name = code;
    for (let i = 0; i < this.shops.length; i++) {
      if (code?.includes(this.shops[i].shopCode)) {
        name = this.shops[i].name;
      }
    }
    return name;
  }
  onDateChange(): void {
    this.loadPageSearch();
  }
  ngOnInit(): void {
    this.accountService.identity().subscribe(account => (this.currentAccount = account));
    if (this.currentAccount?.authorities.includes('ROLE_ADMIN')) {
      this.checkAdmin = true;
    }
    this.handleNavigation();
  }

  trackId(_index: number, item: ITicket): number {
    return item.id!;
  }

  delete(ticket: ITicket): void {
    const modalRef = this.modalService.open(TicketDeleteDialogComponent, { size: 'sm', backdrop: 'static' });
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
      this.router.navigate(['/ticket'], {
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicket>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: (res: HttpResponse<ITicket>) => {
        this.ticket = res.body;
        if (this.ticket.id === null) {
          this.modalContent = 'Cập nhật trạng thái không thành công';
          this.modalService.open(this.contentCalling, { size: 'md', backdrop: 'static' });
        } else {
          this.modalContent = 'Cập nhật trạng thái thành công!';
          this.modalService.open(this.contentCalling, { size: 'md', backdrop: 'static' });
        }
      },
    });
  }
  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
