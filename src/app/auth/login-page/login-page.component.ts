import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/interfaces/interfaces';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  public submited = false;
  public message!: string;
  private routSub!: Subscription;
  private submSub!: Subscription;

  constructor(
    public auth: AuthService,
    private router: Router,
    private rout: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routSub = this.rout.queryParams.subscribe( (params: Params) => {
      if (params['loginAgain']) {
        this.message = 'Please enter your login data'
      };
    });

    this.form = new FormGroup ({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/.+@.+\..+/i)
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return
    }

    this.submited = true;

    const user : User = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.submSub = this.auth.login(user).subscribe( () => {
      this.form.reset;
      this.router.navigate(['/home']);
      this.submited = false;
    }, () => {
      this.submited = false;
    });
  }

  ngOnDestroy(): void {
    this.routSub?.unsubscribe();
    this.submSub?.unsubscribe();
  }

}
