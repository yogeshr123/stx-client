import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ClustersService } from 'src/app/services/clusters.service';

@Component({
  selector: 'app-add-edit-cluster',
  templateUrl: './add-edit-cluster.component.html',
  styleUrls: ['./add-edit-cluster.component.scss']
})
export class AddEditClusterComponent implements OnInit {

  addEditClusterForm: FormGroup;
  routeInfo = {
    path: '',
    isViewOnly: false,
    isEditMode: false
  };
  loader = {
    formData: false,
    saveCluster: false
  };
  oldClusterInfo: any;

  constructor(
    private clustersService: ClustersService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder
  ) {
    this.route.url.subscribe(params => {
      this.routeInfo.path = params[0].path;
      if (this.routeInfo.path.indexOf('view') > -1) {
        this.routeInfo.isViewOnly = true;
      }
      if (this.routeInfo.path.indexOf('edit') > -1) {
        this.routeInfo.isEditMode = true;
      }
    });
  }

  ngOnInit() {
    this.formInit();
    if (this.routeInfo.isEditMode) {
      this.setFormValues();
    }
  }

  formInit() {
    this.addEditClusterForm = this.formBuilder.group({
      CLUSTER_ID: ['', Validators.required],
      ENV_NAME: ['', Validators.required],
      CLUSTER_FOR: ['', Validators.required],
      MASTER_IP_ADD: [
        '',
        Validators.compose([
          Validators.required,
          // tslint:disable-next-line:max-line-length
          Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
        ])
      ],
      LIVY_URL: ['', Validators.required],
      YARN_URL: ['', Validators.required],
      SPARK_URL: ['', Validators.required],
      GANGLIA_URL: ['', Validators.required],
      SPARK_SCRIPT_PATH: '',
      UPDATE_DATE: [new Date(), Validators.required],
      UPDATED_BY: ['User', Validators.required],
    });
  }

  setFormValues() {
    const cluster = this.clustersService.getClusterObject();
    this.oldClusterInfo = this.clustersService.getClusterObject();
    const formControls = this.addEditClusterForm.controls;
    if (cluster) {
      for (const key in formControls) {
        if (formControls.hasOwnProperty(key)) {
          const element = formControls[key];
          element.patchValue(cluster[key]);
        }
      }
    }
  }

  onSubmit() {
    this.loader.saveCluster = true;
    const request = { cluster: this.addEditClusterForm.value, oldClusterInfo: '' };
    request.cluster.UPDATE_DATE = `${new Date()}`;
    let functionToCall = 'addCluster';
    if (this.routeInfo.isEditMode) {
      functionToCall = 'updateCluster';
      request.oldClusterInfo = this.oldClusterInfo;
    }
    this.clustersService[functionToCall](request).subscribe((resp: any) => {
      if (resp && !resp.error) {
        this.showToast('success', 'Successfully Saved.');
        setTimeout(() => {
          this.goBack();
        }, 1000);
      } else {
        this.showToast('error', 'Could not save data.');
      }
      this.loader.saveCluster = false;
    }, error => {
      this.loader.saveCluster = false;
      this.showToast('error', 'Could not save data.');
    });
  }


  populateUrls() {
    if (this.addEditClusterForm.controls.MASTER_IP_ADD.valid) {
      this.addEditClusterForm.controls.LIVY_URL.patchValue(`http://${this.addEditClusterForm.value.MASTER_IP_ADD}:8998`);
      this.addEditClusterForm.controls.YARN_URL.patchValue(`http://${this.addEditClusterForm.value.MASTER_IP_ADD}:8088`);
      this.addEditClusterForm.controls.SPARK_URL.patchValue(`http://${this.addEditClusterForm.value.MASTER_IP_ADD}:8088`);
      this.addEditClusterForm.controls.GANGLIA_URL.patchValue(`http://${this.addEditClusterForm.value.MASTER_IP_ADD}/ganglia`);
    }
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  goBack() {
    this.location.back();
  }

}
