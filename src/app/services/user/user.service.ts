import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import setJWT from '../../utils/setJWT';
import removeJWT from '../../utils/removeJWT';
import UserStore from '../../store/user/user.store';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userStore = inject(UserStore);

  constructor(private http: HttpClient) {
  }

  public getUser() {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/user/auth', {
        refreshToken: localStorage.getItem('refreshToken'),
      }).subscribe({
        next: (data: any) => {
          this.userStore.setUser(data.user);
          setJWT(data.accessToken);
          resolve(data.user);
        },
        error: () => {
          this.userStore.setUser();
          reject(new Error('401 (Unauthorized)'));
        },
      });
    });
  }

  public logout() {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/user/auth/logout', {
        accessToken: localStorage.getItem('accessToken'),
      }).subscribe({
        next: () => {
          removeJWT();
          resolve({});
        },
        error: () => {
          removeJWT();
          reject();
        },
      });
    });
  }
}
