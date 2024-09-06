import dayjs from 'dayjs/esm';

export interface IDepartment {
  id?: number;
  name?: string | null;
  code?: string | null;
  province?: string | null;
}

export class Department implements IDepartment {
  constructor(public id?: number, public name?: string | null, public code?: string | null, public province?: string | null) {}
}

export function getDepartment(department: IDepartment): number | undefined {
  return department.id;
}
