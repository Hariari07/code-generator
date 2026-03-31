import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
 selector: 'app-tenders-edit',
 templateUrl: './tenders-edit.component.html'
})
export class TendersEditComponent {
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