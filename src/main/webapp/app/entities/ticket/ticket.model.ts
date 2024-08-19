import dayjs from 'dayjs/esm';

export interface ITicket {
  id?: number;
  phone?: string | null;
  serviceType?: string | null;
  status?: string | null;
  createdTime?: dayjs.Dayjs | null;
  changeBy?: string | null;
  shopCode?: string | null;
  closedTime?: dayjs.Dayjs | null;
  smsReceived?: string | null;
  province?: string | null;
  smsStatus?: string | null;
  callingStatus?: string | null;
  note?: string | null;
}

export class Ticket implements ITicket {
  constructor(
    public id?: number,
    public phone?: string | null,
    public serviceType?: string | null,
    public status?: string | null,
    public createdTime?: dayjs.Dayjs | null,
    public changeBy?: string | null,
    public shopCode?: string | null,
    public closedTime?: dayjs.Dayjs | null,
    public smsReceived?: string | null,
    public province?: string | null,
    public smsStatus?: string | null,
    public callingStatus?: string | null,
    public note?: string | null
  ) {}
}

export function getTicketIdentifier(ticket: ITicket): number | undefined {
  return ticket.id;
}
