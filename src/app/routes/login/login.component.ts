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
  protected rememberValue: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
  }

  protected async handleFormSubmit(event: any) {
    event.preventDefault();

    this.http.post('http://149.248.78.196/api/user/auth/login', {
      username: this.usernameValue,
      password: this.passwordValue,
      remember: this.rememberValue,
    }).subscribe((data: any) => {
      setJWT(data.accessToken, data.refreshToken);
      this.router.navigate(['/']);
    });
  }
}
