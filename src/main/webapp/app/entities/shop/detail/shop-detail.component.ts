import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITicket } from '../../ticket/ticket.model';
import { IShop } from '../shop.model';
import { NgxQrcodeElementTypes } from 'ngx-qrcode2';

@Component({
  selector: 'jhi-customer-request-detail',
  templateUrl: './shop-detail.component.html',
})
export class ShopDetailComponent {
  shop: IShop | null = null;
  elementType: NgxQrcodeElementTypes = NgxQrcodeElementTypes.URL;
  constructor(protected activatedRoute: ActivatedRoute, protected activeModal: NgbActiveModal, protected router: Router) {}

  // ngOnInit(): void {
  //   this.activatedRoute.data.subscribe(({ ticket }) => {
  //     this.ticket = ticket;
  //   });
  // }

  previousState(): void {
    this.activeModal.dismiss();
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
}
