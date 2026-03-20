import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-employeeAddress-form',
  templateUrl: './employeeAddress.form.component.html',
  styleUrls: ['./employeeAddress.form.component.css']
})
export class EmployeeAddressFormComponent {
  patterns = "^[0-9_-]{10,12}";

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
}
