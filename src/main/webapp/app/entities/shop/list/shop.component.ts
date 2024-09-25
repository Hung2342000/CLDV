import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { ShopService } from '../service/shop.service';
import { ShopDeleteDialogComponent } from '../delete/shop-delete-dialog.component';
import { ShopDetailComponent } from '../detail/shop-detail.component';
import { ITicket } from '../../ticket/ticket.model';
import { finalize } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from '../../../config/input.constants';
import { IShop } from '../shop.model';
import { IDepartment } from '../../ticket/department.model';
import { TicketService } from '../../ticket/service/ticket.service';
import { NgxQrcodeElementTypes } from 'ngx-qrcode2';

@Component({
  selector: 'jhi-shop',
  templateUrl: './shop.component.html',
})
export class ShopComponent implements OnInit {
  @ViewChild('content') content: TemplateRef<any> | undefined;
  shops?: IShop[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  shop?: IShop | any;
  shopQr?: IShop | any;
  modalContent?: string = '';
  searchShopCode?: string = '';
  searchName?: string = '';
  searchProvince?: string = '';
  isSaving = false;
  departments?: IDepartment[] | any;
  elementType: NgxQrcodeElementTypes = NgxQrcodeElementTypes.URL;
  constructor(
    protected ticketService: TicketService,
    protected shopService: ShopService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.shopService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        searchShopCode: this.searchShopCode,
        searchName: this.searchName,
        searchProvince: this.searchProvince,
      })
      .subscribe({
        next: (res: HttpResponse<IShop[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  view(shop: IShop): void {
    const modalRef = this.modalService.open(ShopDetailComponent, { size: 'sm', backdrop: 'static' });
    modalRef.componentInstance.shop = shop;
    this.shopQr = shop;
  }

  loadPageSearch(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    this.shopService
      .query({
        page: 0,
        size: this.itemsPerPage,
        sort: this.sort(),
        searchShopCode: this.searchShopCode,
        searchName: this.searchName,
        searchProvince: this.searchProvince,
      })
      .subscribe({
        next: (res: HttpResponse<IShop[]>) => {
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

  ngOnInit(): void {
    this.handleNavigation();
    this.ticketService.queryDepartment().subscribe({
      next: (res: HttpResponse<IDepartment[]>) => {
        this.departments = res.body;
      },
    });
  }

  delete(shop: IShop): void {
    const modalRef = this.modalService.open(ShopDeleteDialogComponent, { size: 'sm', backdrop: 'static' });
    modalRef.componentInstance.shop = shop;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
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
  closeModal(): void {
    this.modalService.dismissAll();
    location.reload();
  }
  downloadQRCode(): void {
    const qrCodeImage = document.querySelector('ngx-qrcode img') as HTMLImageElement;

    // Tạo URL an toàn cho hình ảnh
    const imageUrl = qrCodeImage.src;

    // Tạo một thẻ a để tải xuống
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'qrcode.png';

    // Thêm thẻ a vào DOM và kích hoạt sự kiện click để tải xuống
    document.body.appendChild(link);
    link.click();

    // Loại bỏ thẻ a sau khi tải xuống
    document.body.removeChild(link);
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'shopCode') {
      result.push('shopCode');
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

  protected onSuccess(data: IShop[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/shop'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.shops = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
