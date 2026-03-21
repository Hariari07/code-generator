import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import config from '../../../../assets/data.json';

@Component({
  selector: 'app-userProfile-form',
  templateUrl: './userProfile.form.component.html',
  styleUrls: ['./userProfile.form.component.css']
})
export class UserProfileFormComponent {

      patterns = "^[0-9_-]{10,12}";

apiurl = `${config.hostip}:${config.hostport}/${config.commonAPI}`;

  countryOptions = [{ label: 'default', value: 'default' }];
  selectedcountry: any;
 
  userProfileForm = new FormGroup({
    userId: new FormControl<number | null>(null, { validators: [Validators.required, Validators.pattern(this.patterns)] }),
    companyName: new FormControl<string>('', { validators: [Validators.required] }),
    address1: new FormControl<string>('', { validators: [Validators.required] }),
    address2: new FormControl<string>('', { validators: [Validators.required] }),
    city: new FormControl<string>('', { validators: [Validators.required] }),
    state: new FormControl<string>('', { validators: [Validators.required] }),
    country: new FormControl<string>('', { validators: [Validators.required] }),
    pinCode: new FormControl<number | null>(null, { validators: [Validators.required, Validators.pattern(this.patterns)] }),
    latitude: new FormControl<string>('', { validators: [Validators.required] }),
    longitude: new FormControl<string>('', { validators: [Validators.required] }),
    contactNo: new FormControl<number | null>(null, { validators: [Validators.required, Validators.pattern(this.patterns)] }),
    emailid: new FormControl<string>('', { validators: [Validators.required, Validators.email] }),
    currencyCode: new FormControl<number | null>(null, { validators: [Validators.required, Validators.pattern(this.patterns)] }),
    profileImageUrl: new FormControl<string>('', { validators: [Validators.required] }),
  });



    async getMasRefNouserProfile(): Promise<any> {
    const data: Observable<any> = this._http.get(this.apiurl + '/hr/master/emp/userProfile/refno');
    return lastValueFrom(data);
    }

    async getAllDatauserProfile(): Promise<any> {
    const data: Observable<any> = this._http.get(this.apiurl + '/hr/master/emp/userProfile/all');
    return lastValueFrom(data);
    }

    insertuserProfile(payload: any) {
      return this._http.post(this.apiurl + '/hr/master/emp/userProfile/create', payload);
    };

    updateuserProfile(payload: any) {
      return this._http.post(this.apiurl + '/hr/master/emp/userProfile/create', payload);
    };

    async seqRunuserProfile(): Promise<any[]> {
    try {
      // Sequentially fetch data using async/await
      const refNo = await this.getMasRefNouserProfile();
      const allData = await this.getAllDatauserProfile();     
      return [refNo, allData];
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
    }
    
}

    