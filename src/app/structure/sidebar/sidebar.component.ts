import { Component, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { CommonService } from 'src/app/services/common.service';
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
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    $(document).ready(function () {
      var treeviewMenu = $('.app-menu');
      // Activate sidebar treeview toggle
      $("[data-toggle='treeview']").click(function (event) {
        event.preventDefault();
        if (!$(this).parent().hasClass('is-expanded')) {
          treeviewMenu.find("[data-toggle='treeview']").parent().removeClass('is-expanded');
        }
        $(this).parent().toggleClass('is-expanded');
      });

      // Set initial active toggle
      $("[data-toggle='treeview.'].is-expanded").parent().toggleClass('is-expanded');
    });

    this.appState = this.commonService.getState();
    if (!isNullOrUndefined(this.appState.loggedInUser)) {
      this.currentUser = this.appState.loggedInUser;
    }
  }
}

