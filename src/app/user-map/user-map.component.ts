import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../user';
import {Subscription} from 'rxjs';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-user-map',
  templateUrl: './user-map.component.html',
  styleUrls: ['./user-map.component.css']
})
export class UserMapComponent implements OnInit, OnDestroy {

  usersByGroupId: Map<string, User[]>;
  usersByGroupIdSubscription: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    console.log('Calling UserMapComponent.ngOnInit');
    this.usersByGroupIdSubscription = this.userService.usersByGroupIdSubject.subscribe(
      res => this.usersByGroupId = res);
    this.userService.getAllUsersByGroupId();
    this.userService.emitUsersGrouped();
  }

  ngOnDestroy(): void {
    this.usersByGroupIdSubscription.unsubscribe();
  }

  getKeysGroups() {
    return Array.from(this.usersByGroupId.keys());
  }

}
