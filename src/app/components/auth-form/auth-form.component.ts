import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  styleUrl: './auth-form.component.css',
})
export class AuthFormComponent {
  private _nameValue = '';
  private _usernameValue = '';
  private _emailValue = '';
  private _passwordValue = '';
  private _rememberValue = false;

  @Input() formType!: 'login' | 'register';

  @Input()
  set nameValue(value: string) {
    this.nameValueChange.emit(value);
    this._nameValue = value;
  }

  get nameValue() {
    return this._nameValue;
  }

  @Input()
  set usernameValue(value: string) {
    this.nameValueChange.emit(value);
    this._usernameValue = value;
  }

  get usernameValue() {
    return this._usernameValue;
  }

  @Input()
  set emailValue(value: string) {
    this.emailValueChange.emit(value);
    this._emailValue = value;
  }

  get emailValue() {
    return this._emailValue;
  }

  @Input()
  set passwordValue(value: string) {
    this.passwordValueChange.emit(value);
    this._passwordValue = value;
  }

  get passwordValue() {
    return this._passwordValue;
  }

  @Input()
  set rememberValue(value: boolean) {
    this.rememberValueChange.emit(value);
    this._rememberValue = value;
  }

  get rememberValue() {
    return this._rememberValue;
  }

  protected handleFormSubmit(event: any) {
    this.submit.emit(event);
  }

  @Output() nameValueChange = new EventEmitter<string>();
  @Output() usernameValueChange = new EventEmitter<string>();
  @Output() emailValueChange = new EventEmitter<string>();
  @Output() passwordValueChange = new EventEmitter<string>();
  @Output() rememberValueChange = new EventEmitter<boolean>();

  @Output() submit = new EventEmitter<any>();
}
