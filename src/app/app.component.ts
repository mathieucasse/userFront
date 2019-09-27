import {Component, ViewChild} from '@angular/core';
import {User} from './user';
import {UserFormComponent} from './user-form/user-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'userFront';

  @ViewChild('formU', {static: true}) userFormComponent: UserFormComponent;

  constructor() {}

  updateUserForm($event: User) {
    this.userFormComponent.userForm.setValue($event);
  }
}
