import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Auth } from '../auth';
import { disallowCharactersValidator, matchingPasswordsValidator } from '../custom-validators';


@Component({
    selector: 'app-register',
    imports: [ AsyncPipe, ReactiveFormsModule ],
    templateUrl: './register.html',
    styleUrl: './register.css',
})
export class Register
{
    private readonly auth = inject(Auth);
    private readonly router = inject(Router);

    public form = new FormGroup({
        username: new FormControl('', [ Validators.required, Validators.minLength(3), disallowCharactersValidator(/\s/i) ]),
        password: new FormControl('', [ Validators.required, Validators.minLength(3), disallowCharactersValidator(/\s/i) ]),
        repeatedPassword: new FormControl('', [ Validators.required ]),
    }, { validators: [ matchingPasswordsValidator ] });

    public errorMessage$ = new BehaviorSubject<string | null>(null);


    public onSubmit()
    {
        if (this.form.controls.username.invalid || this.form.controls.password.invalid)
        {
            this.errorMessage$.next('Please, provide valid username and password.');
            return;
        }

        this.auth.signIn(this.form.value.username!, this.form.value.password!).subscribe({
            complete: () =>
            {
                //alert('Registration was successfull.');
                this.errorMessage$.next(null);
                this.router.navigate([ '/chat' ]);
            },
            error: (err) =>
            {
                if (err instanceof HttpErrorResponse && err.statusText)
                {
                    this.errorMessage$.next(err.statusText);
                }
                else
                {
                    console.debug(err);
                    this.errorMessage$.next('Unknown error occured.');
                }
            },
        });
    }
}
