export interface IReport {
  id?: number;
  ticketId?: number | null;
  actionAudit?: string | null;
  action?: string | null;
}

export class Report implements IReport {
  constructor(public id?: number, public ticketId?: number | null, public actionAudit?: string | null, public action?: string | null) {}
}

export function getReportIdentifier(report: IReport): number | undefined {
  return report.id;
}
