import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/auth/models/signup-user.model';
import { UsersService } from 'src/app/users/users.service';

export class UniqueEmailValidator {
  static uniqueEmailValidator(
    userService: UsersService,
    clonedUser?: User
  ): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ unique: boolean } | null> => {
      const email = control?.value;
      return userService.getCountByEmail(email).pipe(
        map((response: { success: boolean; count: number }) => {
          return response.count && clonedUser?.email !== email
            ? { unique: !!response.count }
            : null;
        })
      );
    };
  }
}
