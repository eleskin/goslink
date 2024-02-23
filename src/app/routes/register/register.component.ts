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
  protected passwordRepeatValue: string = '';

  constructor(private http: HttpClient, private router: Router) {
  }

  protected async handleFormSubmit(event: any) {
    event.preventDefault();

    if (this.passwordValue !== this.passwordRepeatValue) return;

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
