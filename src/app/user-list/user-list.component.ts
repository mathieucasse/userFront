import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {User} from '../user';
import {UserService} from '../service/user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  usersSubscription: Subscription;
  @Output() userCliked = new EventEmitter<User>();

  constructor(private userService: UserService) { }

  ngOnInit() {
    console.log('Calling UserListComponent.ngOnInit');
    this.usersSubscription = this.userService.usersSubject.subscribe(
      users => this.users = users) ;
    this.userService.getAllUsers();
    this.userService.emitUsers();
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

  onEdit(user: User) {
    this.userService.populateForm(user);
    this.userCliked.emit(user);
  }

  onDelete(user: User) {
    this.userService.delete(user);
  }

}
