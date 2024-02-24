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
  private _passwordValue = '';
  private _passwordRepeatValue = '';
  private _rememberValue = false;

  @Input() formType!: 'login' | 'register';
  @Input() title = '';
  @Input() loginStep = '';

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
    this.usernameValueChange.emit(value.replaceAll(/[^A-Za-z0-9]/ig, ''));
    this._usernameValue = value.replaceAll(/[^A-Za-z0-9]/ig, '');
  }

  get usernameValue() {
    return this._usernameValue.replaceAll(/[^A-Za-z0-9]/ig, '');
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
  set passwordRepeatValue(value: string) {
    this.passwordRepeatValueChange.emit(value);
    this._passwordRepeatValue = value;
  }

  get passwordRepeatValue() {
    return this._passwordRepeatValue;
  }

  @Input()
  set rememberValue(value: boolean) {
    this.rememberValueChange.emit(value);
    this._rememberValue = value;
  }

  get rememberValue() {
    return this._rememberValue;
  }

  protected keyPressAlphanumeric(event: any) {
    const navigationKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight',
      'Clear',
      'Copy',
      'Paste',
      'Control',
    ];

    if (navigationKeys.includes(event.key) || /[$a-zA-Z0-9^]/.test(event.key)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  protected changeValueAlphanumeric(event: any) {
    if (/[$a-zA-Z0-9]/.test(event.target.value)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  @Output() nameValueChange = new EventEmitter<string>();
  @Output() usernameValueChange = new EventEmitter<string>();
  @Output() passwordValueChange = new EventEmitter<string>();
  @Output() passwordRepeatValueChange = new EventEmitter<string>();
  @Output() rememberValueChange = new EventEmitter<boolean>();

  @Output() submit = new EventEmitter<any>();
}
