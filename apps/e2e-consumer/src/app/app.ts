import { DOCUMENT } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WiButtonComponent } from '@wiloc/ui/button';
import {
  WiCardComponent,
  WiCardContentComponent,
  WiCardDescriptionComponent,
  WiCardFooterComponent,
  WiCardHeaderComponent,
  WiCardTitleComponent,
} from '@wiloc/ui/data-display';
import { WiDatepickerComponent, WiInputComponent, WiSelectComponent } from '@wiloc/ui/forms';
import { WiIconComponent } from '@wiloc/ui/icon';
import {
  WiDialogCloseDirective,
  WiDialogComponent,
  WiDialogContentComponent,
  WiDialogDescriptionComponent,
  WiDialogFooterComponent,
  WiDialogHeaderComponent,
  WiDialogPortalDirective,
  WiDialogTitleComponent,
  WiDialogTriggerDirective,
  WiTooltipDirective,
} from '@wiloc/ui/overlays';

import { appLocale, toggleAppLocale, uiMessages } from './locale';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    WiButtonComponent,
    WiCardComponent,
    WiCardContentComponent,
    WiCardDescriptionComponent,
    WiCardFooterComponent,
    WiCardHeaderComponent,
    WiCardTitleComponent,
    WiDatepickerComponent,
    WiDialogCloseDirective,
    WiDialogComponent,
    WiDialogContentComponent,
    WiDialogDescriptionComponent,
    WiDialogFooterComponent,
    WiDialogHeaderComponent,
    WiDialogPortalDirective,
    WiDialogTitleComponent,
    WiDialogTriggerDirective,
    WiIconComponent,
    WiInputComponent,
    WiSelectComponent,
    WiTooltipDirective,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly document = inject(DOCUMENT);

  protected readonly title = 'e2e-consumer · @wiloc/ui (.tgz)';
  protected readonly dark = signal(false);
  protected readonly loading = signal(false);
  protected readonly locale = appLocale;
  protected readonly t = uiMessages;

  protected readonly nameControl = new FormControl('Wiloc', { nonNullable: true });
  protected readonly fruit = signal<string | null>(null);
  protected readonly date = signal<Date | null>(null);

  constructor() {
    effect(() => {
      this.document.documentElement.lang = this.locale();
    });
  }

  protected toggleTheme(): void {
    const next = !this.dark();
    this.dark.set(next);
    this.document.documentElement.classList.toggle('wi-dark', next);
  }

  protected toggleLanguage(): void {
    toggleAppLocale();
    this.fruit.set(null);
  }

  protected simulateLoading(): void {
    this.loading.set(true);
    globalThis.setTimeout(() => this.loading.set(false), 1200);
  }

  /** YYYY-MM-DD en zona local (evitar el desfase de `toISOString`). */
  protected formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
