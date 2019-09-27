import { Component, OnInit } from '@angular/core';
import {UserService} from '../service/user.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  userForm: FormGroup;
  submitted: boolean;
  showSuccessMessage: boolean;

  constructor(private  userService: UserService) { }

  ngOnInit() {
    this.userForm = this.userService.form;
  }

  onSubmit() {
    this.submitted = true;
    console.log('userForm onSubmit ' + this.userForm.valid);
    this.logSubmit();
    if (this.userForm.valid) {
      this.userService.saveUser(this.userForm.value);
      this.showSuccessMessage = true;
      setTimeout(() => this.showSuccessMessage = false, 7000);
      console.log('userForm Submitted');
    }
    this.submitted = false;
    this.resetForm();
  }

  keyIdIsNull() {
    return this.userService.keyIdIsNull();
  }

  onBack() {

  }

  resetForm() {
    this.userService.resetForm();
    this.userForm = this.userService.form;
  }

  logSubmit() {
    console.log(this.userForm.controls.value);
    console.log('id : ');
    console.log(this.userForm.controls.id);
    console.log('name : ');

    console.log(this.userForm.controls.name);
    console.log('groupId : ');
    console.log(this.userForm.controls.groupId);

    console.log(this.submitted);

    // console.log('----f--- invalid ? ' + (this.submitted && this.formControls.dateContact.invalid));
    // console.log('----e--- invalid ?' + (this.submitted && this.formControls.poste.invalid));
    // console.log('----m--- invalid ?' + (this.submitted && this.formControls.statut.invalid));
    // console.log('----l--- invalid ?' + (this.submitted && this.formControls.contactNom.invalid));
    // console.log('Form Valid = ' + this.rechercheService.form.valid);
    console.log('Form Value = ' );
    console.log(this.userService.form.value);
  }
}
