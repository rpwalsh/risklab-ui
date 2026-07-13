import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import type { WorkbenchState } from './model';
import { WorkbenchService } from './WorkbenchService';

@Component({
  selector: 'ui-workbench-provider',
  standalone: true,
  imports: [],
  template: `<ng-content />`,
  styles: [':host { display: contents; }'],
  providers: [WorkbenchService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbenchProvider {
  readonly initialState = input<Partial<WorkbenchState> | undefined>(undefined);
  readonly workbench = inject(WorkbenchService);

  constructor() {
    effect(() => {
      this.workbench.initialize(this.initialState());
    });
  }
}
