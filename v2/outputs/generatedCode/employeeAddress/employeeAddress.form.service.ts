import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import config from '../../../../assets/data.json';

@Component({
  selector: 'app-employeeAddress-form',
  templateUrl: './employeeAddress.form.component.html',
  styleUrls: ['./employeeAddress.form.component.css']
})
export class EmployeeAddressFormComponent {

      patterns = "^[0-9_-]{10,12}";

apiurl = `${config.hostip}:${config.hostport}/${config.commonAPI}`;

  employeeAddressForm = new FormGroup({
    employeeCode: new FormControl<number | null>(null, { validators: [Validators.required, Validators.pattern(this.patterns)] }),
    addressType: new FormControl<string>('', { validators: [Validators.required] }),
    addressLine1: new FormControl<string>('', { validators: [Validators.required] }),
    addressLine2: new FormControl<string>('', { validators: [Validators.required] }),
    city: new FormControl<string>('', { validators: [Validators.required] }),
    state: new FormControl<string>('', { validators: [Validators.required] }),
    pinCode: new FormControl<number | null>(null, { validators: [Validators.required, Validators.pattern(this.patterns)] }),
    country: new FormControl<string>('', { validators: [Validators.required] }),
  });



    async getMasRefNoemployeeAddress(): Promise<any> {
    const data: Observable<any> = this._http.get(this.apiurl + '/hr/master/emp//employeeAddress/refno');
    return lastValueFrom(data);
    }

    async getAllDataemployeeAddress(): Promise<any> {
    const data: Observable<any> = this._http.get(this.apiurl + '/hr/master/emp//employeeAddress/all');
    return lastValueFrom(data);
    }

    insertemployeeAddress(payload: any) {
      return this._http.post(this.apiurl + '/hr/master/emp//employeeAddress/create', payload);
    };

    updateemployeeAddress(payload: any) {
      return this._http.post(this.apiurl + '/hr/master/emp//employeeAddress/create', payload);
    };

    async seqRunemployeeAddress(): Promise<any[]> {
    try {
      // Sequentially fetch data using async/await
      const refNo = await this.getMasRefNoemployeeAddress();
      const allData = await this.getAllDataemployeeAddress();     
      return [refNo, allData];
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
    }
    
}

    