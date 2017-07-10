import {Component } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, Subscription } from 'rxjs';

import { EmpRecordsService } from '../../../core/emprecords.service';

@Component({
	selector: 'emp-records',
	templateUrl: './emprecords.component.html',
  	styleUrls: ['./emprecords.component.css']
})
export class EmpRecordsComponent {
	files : FileList;
	response: Observable<any>;
	message: string;
	constructor(private empRecordService: EmpRecordsService) {
	}

	getFiles(event){ 
        this.files = event.target.files;
    }

    submitFile() {
    	this.response = this.empRecordService.fileUpload(this.files);
    	this.response.subscribe((res) => this.message = res._body);
    }
}