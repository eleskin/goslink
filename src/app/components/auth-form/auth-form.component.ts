import {Component, Input} from '@angular/core';
import {ButtonComponent} from '../../ui/button/button.component';
import {CheckboxComponent} from '../../ui/checkbox/checkbox.component';
import {FormComponent} from '../../ui/form/form.component';
import {InputComponent} from '../../ui/input/input.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    ButtonComponent,
    CheckboxComponent,
    FormComponent,
    InputComponent,
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    NgIf,
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent {
  @Input() handleFormSubmit!: (event: any) => void;
  @Input() formType!: 'login' | 'register';
  protected nameValue: string = '';
  protected usernameValue: string = '';
  protected emailValue: string = '';
  protected passwordValue: string = '';
  protected rememberValue: boolean = false;
}
