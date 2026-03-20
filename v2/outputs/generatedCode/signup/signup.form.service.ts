import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import config from '../../../../assets/data.json';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup.form.component.html',
  styleUrls: ['./signup.form.component.css']
})
export class SignupFormComponent {

      patterns = "^[0-9_-]{10,12}";

apiurl = `${config.hostip}:${config.hostport}/${config.commonAPI}`;

  branchNameOptions = [{ label: 'default', value: 'default' }];
  selectedbranchName: any;
 
  signupForm = new FormGroup({
    idsignup: new FormControl<string>('', { validators: [Validators.required] }),
    branchName: new FormControl<string>('', { validators: [Validators.required] }),
    userName: new FormControl<string>('', { validators: [Validators.required] }),
    password: new FormControl<string>('', { validators: [Validators.required] }),
    emailid: new FormControl<string>('', { validators: [Validators.required, Validators.email] }),
    referalCode: new FormControl<string>('', { validators: [Validators.required] }),
    activeStatus: new FormControl<string>('', { validators: [Validators.required] }),
  });



    async getMasRefNosignup(): Promise<any> {
    const data: Observable<any> = this._http.get(this.apiurl + '/register/signup/refno');
    return lastValueFrom(data);
    }

    async getAllDatasignup(): Promise<any> {
    const data: Observable<any> = this._http.get(this.apiurl + '/register/signup/all');
    return lastValueFrom(data);
    }

    insertsignup(payload: any) {
      return this._http.post(this.apiurl + '/register/signup/create', payload);
    };

    updatesignup(payload: any) {
      return this._http.post(this.apiurl + '/register/signup/create', payload);
    };

    async seqRunsignup(): Promise<any[]> {
    try {
      // Sequentially fetch data using async/await
      const refNo = await this.getMasRefNosignup();
      const allData = await this.getAllDatasignup();     
      return [refNo, allData];
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
    }
    
}

    