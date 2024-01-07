import {Component, Input} from '@angular/core';
import {ButtonComponent} from '../../ui/button/button.component';
import {CheckboxComponent} from '../../ui/checkbox/checkbox.component';
import {FormComponent} from '../../ui/form/form.component';
import {InputComponent} from '../../ui/input/input.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

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
	],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent {
  @Input() handleFormSubmit!: (event: any) => void;
  @Input() formType!: 'login' | 'register';
}
