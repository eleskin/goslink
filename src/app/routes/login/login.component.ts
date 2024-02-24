import {Component} from '@angular/core';
import setJWT from '../../utils/setJWT';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AuthFormComponent} from '../../components/auth-form/auth-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AuthFormComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  protected usernameValue: string = '';
  protected passwordValue: string = '';

  protected title = 'Enter your username'
  protected loginStep = 'username';

  constructor(private http: HttpClient, private router: Router) {
  }

  protected async handleFormSubmit(event: any) {
    event.preventDefault();

    if (this.loginStep === 'username') {
      this.http.get(`hhttps://api.goslink-messenger.online/api/user/auth/login?username=${this.usernameValue}`)
        .subscribe({
          next: (data: any) => {
            this.title = `Hello, ${data.name}`;
            this.loginStep = 'password';
          },
          error: (error: any) => {
            console.log(error);
          },
        });
    } else if (this.loginStep === 'password') {
      this.http.post('https://api.goslink-messenger.online/api/user/auth/login', {
        username: this.usernameValue,
        password: this.passwordValue,
      }).subscribe((data: any) => {
        setJWT(data.accessToken, data.refreshToken);
        this.router.navigate(['/']);
      });
    }
  }
}
