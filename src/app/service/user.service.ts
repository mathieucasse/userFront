import { Injectable } from '@angular/core';
import {Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {User} from '../user';
import {FormBuilder, Validators} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[] = [];
  usersSubject = new Subject<User[]>();

  usersByGroupId: Map<string, User[]>;
  usersByGroupIdSubject = new  Subject<Map<string, User[]>>();
  baseUrl = 'http://localhost:8080/user';

  form = this.formBuider.group(this.initForm());

  constructor(private formBuider: FormBuilder,
              private httpClient: HttpClient) { }

  getAllUsers() {
    console.log('--- getAllUsers from ' + this.baseUrl + '/all');
    if (this.users.length !== 0) {
      console.log(this.users);
      return this.users;
    }
    return this.httpClient.get<User[]>(this.baseUrl + '/all').subscribe((res) => {
        console.log(res);
        this.users = res;
        this.emitUsers();
      },
      error => console.error(error));
  }

  getAllUsersByGroupId() {
    console.log('--- getAllUsersByGroupId from ' + this.baseUrl + '/allGroupByGroupId');
    return this.httpClient.get<Map<string, User[]>>(this.baseUrl + '/allGroupByGroupId').subscribe((res) => {
        console.log('--- getAllUsers retreiving');
        console.log(JSON.stringify(res));
        this.usersByGroupId = res;
        this.emitUsersGrouped();
      },
      error => console.error(error));
  }
  saveUser(user: User) {
    this.httpClient.post<User>(this.baseUrl + '/save', user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(
      (res: User) => {
        console.log('insert recherche');
        console.log(res);
        if (user.id) {
          const userIndexToRemove = this.getUserIndexToRemove(res.id);
          this.users.splice(userIndexToRemove, 1);
        }
        this.users.push(res);
        this.emitUsers();
      },
      error => this.handleError(error));
  }

  delete(user: User) {

    console.log('tryin to delete this user ' + user.id);

    this.httpClient.delete<User>(this.baseUrl + '/' + user.id).subscribe(
      () => {
        console.log('Recherche with id' + user + 'deleted !!');
        const userIndexToRemove = this.getUserIndexToRemove(user.id);
        this.users.splice(userIndexToRemove, 1);
        this.emitUsers();
      },
      (error) => this.handleError(error));
  }

  emitUsers() {
    this.users.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0; });
    console.log('Emit Users ' +  this.users);
    this.usersSubject.next(this.users);
    this.getAllUsersByGroupId();
  }

  emitUsersGrouped() {
    console.log('Emit emitUsersGrouped ' +  this.usersByGroupId);
    this.usersByGroupIdSubject.next(this.usersByGroupId);
  }


  keyIdIsNull() {
    return this.form.get('id').value === null;
  }

  populateForm(user: User) {
    this.form.setValue(user);
  }

  initForm() {
    return {
      id: [null],
      name: ['', Validators.required],
      groupId: ['', Validators.required]
    };
  }

  resetForm() {
    this.form.reset();
    this.form = this.formBuider.group(this.initForm());
  }

  handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side error : ' + errorResponse.error.message);
    } else {
      console.error('Server Side error : ' + errorResponse);
    }
    return throwError('There is a problem with the sevice ');
  }

  private getUserIndexToRemove(id: string) {
      return this.users.findIndex(
        (userEl) => {
          if (userEl.id === id) {
            return true;
          }});
  }
}
