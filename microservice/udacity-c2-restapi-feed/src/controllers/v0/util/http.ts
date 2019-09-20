import {config} from '../../../config/config';
// import { HttpClient, HttpHeaders,  HttpErrorResponse, HttpRequest, HttpEvent } from '@angular/common/http';
// import { catchError, tap, map } from 'rxjs/operators';
import axios from 'axios';

const API_HOST = config.dev.host_img;
export class Http {
    httpOptions = {
        headers: {'Content-Type': 'application/json'}
    };

    // get(endpoint): Promise<any> {
    //     const url = `${API_HOST}${endpoint}`;
    //     const req = this.http.get(url, this.httpOptions).pipe(map(this.extractData));
    
    //     return req
    //             .toPromise()
    //             .catch((e) => {
    //               this.handleError(e);
    //               throw e;
    //             });
    // }

    
    public async get(endpoint: string): Promise<any> {
        const url = `${API_HOST}${endpoint}`;
        const req = axios.get(url, this.httpOptions);
    
        return await req
                .catch((e) => {
                  this.handleError(e);
                  throw e;
                });
    }

    handleError(error: Error) {
        console.log(error.message);
    }
};