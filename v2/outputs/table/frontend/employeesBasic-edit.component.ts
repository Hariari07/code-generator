import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
 selector: 'app-employeesBasic-edit',
 templateUrl: './employeesBasic-edit.component.html'
})
export class EmployeesBasicEditComponent {
  form: FormGroup;
  showEdit = false;

  constructor(private fb: FormBuilder){
    this.form = this.fb.group({
      [object Object]: [''],
      [object Object]: [''],
      [object Object]: [''],
      [object Object]: [''],
      [object Object]: [''],
      [object Object]: [''],
      [object Object]: [''],
      [object Object]: [''],
      [object Object]: [''],
      [object Object]: [''],
    });
  }
}