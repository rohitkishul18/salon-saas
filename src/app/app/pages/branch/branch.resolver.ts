import { ResolveFn } from '@angular/router';

export const branchResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
