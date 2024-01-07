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
  protected emailValue: string = '';
  protected passwordValue: string = '';
  protected rememberValue: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  protected async handleFormSubmit(event: any) {
    event.preventDefault();

    this.http.post('http://localhost:3000/api/user/auth/login', {
      email: this.emailValue,
      password: this.passwordValue,
      remember: this.rememberValue,
    }).subscribe((data: any) => {
      setJWT(data.accessToken, data.refreshToken);
      this.router.navigate(['/']);
    });
  }
}
