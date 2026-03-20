import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-employees-form',
  templateUrl: './employees.form.component.html',
  styleUrls: ['./employees.form.component.css']
})
export class EmployeesFormComponent {
  patterns = "^[0-9_-]{10,12}";

  genderOptions = [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }];
  selectedgender: any;
 
  motherTongueOptions = [{ label: 'Tamil', value: 'Tamil' }, { label: 'English', value: 'English' }, { label: 'Kannada', value: 'Kannada' }];
  selectedmotherTongue: any;
 
  readingLanguageOptions = [{ label: 'Tamil', value: 'Tamil' }, { label: 'English', value: 'English' }, { label: 'Kannada', value: 'Kannada' }];
  selectedreadingLanguage: any;
 
  speakingLanguageOptions = [{ label: 'Tamil', value: 'Tamil' }, { label: 'English', value: 'English' }, { label: 'Kannada', value: 'Kannada' }];
  selectedspeakingLanguage: any;
 
  designationOptions = [{ label: 'HR', value: 'HR' }, { label: 'IT', value: 'IT' }, { label: 'Sales', value: 'Sales' }];
  selecteddesignation: any;
 
  departmentOptions = [{ label: 'Executive', value: 'Executive' }, { label: 'Sr.Executive', value: 'Sr.Executive' }, { label: 'Manager', value: 'Manager' }];
  selecteddepartment: any;
 
  workingStatusOptions = [{ label: 'Active', value: 'Active' }, { label: 'In-Active', value: 'In-Active' }, { label: 'Resigned', value: 'Resigned' }];
  selectedworkingStatus: any;
 
  employeesForm = new FormGroup({
    employeeCode: new FormControl<number | null>(null, { validators: [Validators.required, Validators.pattern(this.patterns)] }),
    name: new FormControl<string>('', { validators: [Validators.required] }),
    gender: new FormControl<string>('', { validators: [Validators.required] }),
    dob: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    bloodGroup: new FormControl<string>(''),
    motherTongue: new FormControl<string>('', { validators: [Validators.required] }),
    readingLanguage: new FormControl<string>('', { validators: [Validators.required] }),
    speakingLanguage: new FormControl<string>('', { validators: [Validators.required] }),
    emailId: new FormControl<string>('', { validators: [Validators.required] }),
    contact: new FormControl<number | null>(null, { validators: [Validators.required, Validators.pattern(this.patterns)] }),
    emergencyContact: new FormControl<number | null>(null, { validators: [Validators.pattern(this.patterns)] }),
    doj: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    designation: new FormControl<string>('', { validators: [Validators.required] }),
    department: new FormControl<string>('', { validators: [Validators.required] }),
    workingStatus: new FormControl<string>('', { validators: [Validators.required] }),
    dateOfExit: new FormControl<Date | null>(null),
  });
}
