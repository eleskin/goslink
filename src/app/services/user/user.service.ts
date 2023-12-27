import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import setJWT from '../../utils/setJWT';
import removeJWT from '../../utils/removeJWT';
import UserStore from '../../store/user/user.store';
import RoomsStore from '../../store/rooms/rooms.store';
import User from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userStore = inject(UserStore);
  private readonly roomsStore = inject(RoomsStore);

  constructor(private http: HttpClient) {
  }

  public searchUser(value: string): Promise<Pick<User, 'name' | 'username'>> {
    return new Promise((resolve) => {
      if (value.length > 1 && value.search(/^@[a-zA-Z0-9]*/) !== -1) {
        this.http.get('http://localhost:3000/api/user/search', {
          params: {
            username: value.trim().substring(1).toLowerCase(),
          },
        }).subscribe((data: any) => {
          if (Object.keys(data).length) {
            resolve(data);
          }
        });
      }
    });
  }

  public getUser() {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/user/auth', {
        refreshToken: localStorage.getItem('refreshToken'),
      }).subscribe({
        next: (data: any) => {
          this.userStore.setUser(data.user);
          this.roomsStore.setRooms(data.rooms);
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
