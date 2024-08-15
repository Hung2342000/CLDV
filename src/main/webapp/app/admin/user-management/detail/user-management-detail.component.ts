import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../user-management.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-user-mgmt-detail',
  templateUrl: './user-management-detail.component.html',
})
export class UserManagementDetailComponent {
  user: User | null = null;

  constructor(protected router: Router, protected activeModal: NgbActiveModal) {}

  previousState(): void {
    this.router.navigate(['/admin/user-management']);
    this.activeModal.dismiss();
  }
}
