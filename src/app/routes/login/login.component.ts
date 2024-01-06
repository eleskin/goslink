import {Component} from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {ButtonComponent} from '../../ui/button/button.component';
import {CheckboxComponent} from '../../ui/checkbox/checkbox.component';
import {RouterLink} from '@angular/router';
import {FormComponent} from '../../ui/form/form.component';
import setJWT from '../../utils/setJWT';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    CheckboxComponent,
    RouterLink,
    FormComponent,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  protected emailValue: string = '';
  protected passwordValue: string = '';
  protected rememberValue: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
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
