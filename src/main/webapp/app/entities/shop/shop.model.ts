import dayjs from 'dayjs/esm';

export interface IShop {
  id?: number;
  shopCode?: string;
  name?: string | null;
  address?: string | null;
  province?: string | null;
  district?: string | null;
  code?: string | null;
}

export class Shop implements IShop {
  constructor(
    public id?: number,
    public shopCode?: string,
    public name?: string | null,
    public address?: string | null,
    public province?: string | null,
    public district?: string | null,
    public code?: string | null
  ) {}
}

export function getShop(shop: IShop): number | undefined {
  return shop.id;
}
