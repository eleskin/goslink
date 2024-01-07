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
  protected emailValue: string = '';
  protected passwordValue: string = '';

  constructor(private http: HttpClient, private router: Router) {
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  protected async handleFormSubmit(event: any) {
    event.preventDefault();

    this.http.post('http://localhost:3000/api/user/auth/register', {
      name: this.nameValue,
      username: this.usernameValue,
      email: this.emailValue,
      password: this.passwordValue,
    }).subscribe((data: any) => {
      setJWT(data.accessToken, data.refreshToken);
      this.router.navigate(['/']);
    });
  }
}
