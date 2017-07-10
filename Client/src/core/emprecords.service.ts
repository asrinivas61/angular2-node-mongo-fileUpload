import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { config } from '../config/app.config';

@Injectable()
export class EmpRecordsService {
	config: any;
	constructor(private http: Http) {
		this.config = config.API_ENDPOINT;
	}

	fileUpload(fileList): Observable<any> {
	    if(fileList.length > 0) {
	        let file: File = fileList[0];
	        console.log(window);
	        let formData:FormData = new FormData();
	        formData.append('fileUpload', file, file.name);
	        return this.http.post(`${this.config}/Wipro-EmpData/submit`, formData)
	            .map(res => res)
	            .catch(error => Observable.throw(error))
	    }
	}
}