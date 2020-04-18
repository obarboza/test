import { Injectable } from '@angular/core';
import { AppConfig } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/user';

@Injectable()
export class UserService {
  private urlUser = AppConfig.serverURL + 'user';
  private urlLogin = AppConfig.serverURL + 'login';

  user: User;
  token: String;

  constructor(public http: HttpClient) { }

  public singIn(user: any): Observable<User> {
    return this.http.post(this.urlLogin, user).
      pipe(map((res: any) => {
        localStorage.setItem('id', res.id);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.user = res.user;
        this.token = res.token;
        return res.user;
      }));
  }
  public singInGoogle(token: any): Observable<User> {
    return this.http.post(this.urlLogin + '/google', { token }).
      pipe(map((res: any) => {
        localStorage.setItem('id', res.id);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.user = res.user;
        this.token = res.token;
        return res.user;
      }));
  }
}
