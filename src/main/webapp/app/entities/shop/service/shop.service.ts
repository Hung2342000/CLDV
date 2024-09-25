import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { getShop, IShop } from '../shop.model';
import { createRequestOption } from '../../../core/request/request-util';
import { getTicketIdentifier, ITicket } from '../../ticket/ticket.model';

export type EntityResponseType = HttpResponse<IShop>;
export type EntityArrayResponseType = HttpResponse<IShop[]>;

@Injectable({ providedIn: 'root' })
export class ShopService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shop');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shop: IShop): Observable<EntityResponseType> {
    return this.http.post<IShop>(this.resourceUrl, shop, { observe: 'response' }).pipe(map((res: EntityResponseType) => res));
  }
  update(shop: IShop): Observable<EntityResponseType> {
    return this.http
      .put<IShop>(`${this.resourceUrl}/${getShop(shop) as number}`, shop, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => res));
  }
  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShop[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => res));
  }
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IShop>(`${this.resourceUrl}/${id}`, { observe: 'response' }).pipe(map((res: EntityResponseType) => res));
  }
}
