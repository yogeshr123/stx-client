import { Component, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { CommonService } from 'src/app/services/common.service';
import { UsersService } from 'src/app/services/users.service';
declare var $: any;

@Component({
  selector: 'app-defaultsidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})

export class SidebarComponent implements OnInit {
  appState: any;
  currentUser: any;

  constructor(
    private usersService: UsersService,
    private commonService: CommonService,
  ) {
    this.usersService.changeProfile.subscribe(() => {
      this.getState();
    });
  }



  ngOnInit() {
    $(document).ready(() => {
      const treeviewMenu = $('.app-menu');
      // Activate sidebar treeview toggle
      $('[data-toggle=\'treeview\']').click((event) => {
        event.preventDefault();
        if (!$(this).parent().hasClass('is-expanded')) {
          treeviewMenu.find('[data-toggle=\'treeview\']').parent().removeClass('is-expanded');
        }
        $(this).parent().toggleClass('is-expanded');
      });

      // Set initial active toggle
      $('[data-toggle=\'treeview.\'].is-expanded').parent().toggleClass('is-expanded');
    });

    this.getState();
  }


  getState() {
    this.appState = this.commonService.getState();
    if (!isNullOrUndefined(this.appState.loggedInUser)) {
      this.currentUser = this.appState.loggedInUser;
    }
  }



}

