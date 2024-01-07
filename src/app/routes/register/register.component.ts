import {Component} from '@angular/core';
import {ButtonComponent} from '../../ui/button/button.component';
import {CheckboxComponent} from '../../ui/checkbox/checkbox.component';
import {FormComponent} from '../../ui/form/form.component';
import {InputComponent} from '../../ui/input/input.component';
import {Router, RouterLink} from '@angular/router';
import setJWT from '../../utils/setJWT';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ButtonComponent,
    CheckboxComponent,
    FormComponent,
    InputComponent,
    RouterLink,
    FormsModule,
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
