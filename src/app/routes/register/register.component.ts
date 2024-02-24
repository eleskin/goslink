import {Component} from '@angular/core';
import {Router} from '@angular/router';
import setJWT from '../../utils/setJWT';
import {HttpClient} from '@angular/common/http';
import {AuthFormComponent} from '../../components/auth-form/auth-form.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    AuthFormComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  protected nameValue: string = '';
  protected usernameValue: string = '';
  protected passwordValue: string = '';

  protected title = 'Start your journey with Goslink'
  protected loginStep = 'username';

  constructor(private http: HttpClient, private router: Router) {
  }

  protected async handleFormSubmit(event: any) {
    event.preventDefault();

    if (this.loginStep === 'username') {
      this.http.get(`http://149.248.78.196/api/user/auth/login?username=${this.usernameValue}`)
        .subscribe({
          next: (data: any) => {
            console.log(data);
          },
          error: (error: any) => {
            console.log(error);
            this.loginStep = 'password';
          },
        });
    } else if (this.loginStep === 'password') {
      this.http.post('http://149.248.78.196/api/user/auth/register', {
        name: this.nameValue,
        username: this.usernameValue,
        password: this.passwordValue,
      }).subscribe((data: any) => {
        setJWT(data.accessToken, data.refreshToken);
        this.router.navigate(['/']);
      });
    }
  }
}
