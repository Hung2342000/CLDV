import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ShopService } from '../service/shop.service';
import { IShop, Shop } from '../shop.model';
import { IDepartment } from '../../ticket/department.model';
import { TicketService } from '../../ticket/service/ticket.service';

@Component({
  selector: 'jhi-shop-update',
  templateUrl: './shop-update.component.html',
})
export class ShopUpdateComponent implements OnInit {
  isSaving = false;
  isEdit = false;
  departments?: IDepartment[] | any;

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    shopCode: [],
    name: [],
    address: [],
    province: [],
  });

  constructor(
    protected ticketService: TicketService,
    protected shopService: ShopService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticket }) => {
      if (ticket.id !== null && ticket.id !== undefined) {
        this.isEdit = true;
      }
      this.updateForm(ticket);
    });
    this.ticketService.queryDepartment().subscribe({
      next: (res: HttpResponse<IDepartment[]>) => {
        this.departments = res.body;
      },
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shop = this.createFromForm();
    if (shop.id !== undefined) {
      this.subscribeToSaveResponse(this.shopService.update(shop));
    } else {
      this.subscribeToSaveResponse(this.shopService.create(shop));
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
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShop>>): void {
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

  protected updateForm(shop: IShop): void {
    this.editForm.patchValue({
      id: shop.id,
      shopCode: shop.shopCode,
      name: shop.name,
      address: shop.address,
      province: shop.province,
    });
  }

  protected createFromForm(): IShop {
    return {
      ...new Shop(),
      id: this.editForm.get(['id'])!.value,
      shopCode: this.editForm.get(['shopCode'])!.value,
      name: this.editForm.get(['name'])!.value,
      address: this.editForm.get(['address'])!.value,
      province: this.editForm.get(['province'])!.value,
    };
  }
}
