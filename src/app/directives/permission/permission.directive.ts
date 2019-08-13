import { Directive, ElementRef, Input } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective {
  @Input() expectedPermission: string;
  appState: any;

  constructor(private elRef: ElementRef,
    private commonService: CommonService) {
  }
  ngAfterViewInit(): void {
    this.appState = this.commonService.getState();
    if (!this.appState.loggedInUserPermissions.includes(this.expectedPermission)) {
      this.elRef.nativeElement.style.display = 'none';
    }
  }
}
