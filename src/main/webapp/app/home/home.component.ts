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
import { IDepartment } from '../entities/ticket/department.model';
import { IShop } from '../entities/shop/shop.model';

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
  shopCode?: string | null = '';
  shop?: IShop | null;
  departments?: IDepartment[] | any;
  shops?: IShop[] | any;
  shopCheck?: IShop | any;
  editForm = this.fb.group({
    id: [null, [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^(0?)(3|5|7|8|9)[0-9]{8}$')]],
    serviceType: [null, [Validators.required]],
    province: [],
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
    this.shopCode = this.activatedRoute.snapshot.paramMap.get('shopCode');
    this.ticketService.findShop(typeof this.shopCode === 'string' ? this.shopCode : '').subscribe({
      next: (res: HttpResponse<IShop>) => {
        this.shopCheck = res.body;
        if (this.shopCheck === null) {
          this.router.navigate(['404']);
        }
      },
    });
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  closeModal(): void {
    this.modalService.dismissAll();
    location.reload();
  }
  shopProvince(code: string | null | undefined): any {
    let name = code;
    for (let i = 0; i < this.shops.length; i++) {
      if (code?.includes(this.shops[i].shopCode)) {
        name = this.shops[i].province;
      }
    }
    return name;
  }
  shopProvinceName(code: string | null | undefined): any {
    let name = code;
    for (let i = 0; i < this.shops.length; i++) {
      if (code?.includes(this.shops[i].shopCode)) {
        name = this.shops[i].province;
      }
    }
    return this.shopDepartment(name);
  }
  shopDepartment(code: string | null | undefined): any {
    let name = code;
    for (let i = 0; i < this.departments.length; i++) {
      if (code?.includes(this.departments[i].code)) {
        name = this.departments[i].province;
      }
    }
    return name;
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
  save(): void {
    this.isSaving = true;
    const ticket = this.createFromForm();
    ticket.shopCode = this.shopCode;
    ticket.province = this.shopProvince(this.shopCode);
    if (!this.editForm.get('phone')?.invalid && !this.editForm.get('serviceType')?.invalid) {
      // Xử lý logic khi form hợp lệ
      this.modalContent =
        'Cảm ơn quý khách đã dành thời gian sử dụng dịch vụ của chúng tôi. Hy vọng sẽ sớm được phục vụ quý khách trong tương lai.';
      this.subscribeToSaveResponse(this.ticketService.create(ticket));
    } else {
      this.modalContent = 'Thông tin chưa hợp lệ.Quý khách vui lòng nhập lại';
      this.previousState();
    }
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
      // province: this.editForm.get(['province'])!.value,
    };
  }
}
