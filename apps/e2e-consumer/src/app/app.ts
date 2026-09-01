import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WiButtonComponent } from '@wiloc/ui/button';
import {
  WiCardComponent,
  WiCardContentComponent,
  WiCardDescriptionComponent,
  WiCardFooterComponent,
  WiCardHeaderComponent,
  WiCardTitleComponent,
  type WiColumnDef,
  type WiColumnFilter,
  WiTableCellDirective,
  WiTableComponent,
} from '@wiloc/ui/data-display';
import {
  WiCheckboxComponent,
  WiDatepickerComponent,
  WiFileUploadComponent,
  type WiFileUploadRejection,
  WiInputComponent,
  WiListboxComponent,
  WiOtpComponent,
  WiPicklistComponent,
  WiSelectComponent,
  WiSwitchComponent,
} from '@wiloc/ui/forms';
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
  WiPopoverCloseDirective,
  WiPopoverComponent,
  WiPopoverContentComponent,
  WiPopoverDescriptionComponent,
  WiPopoverHeaderComponent,
  WiPopoverPortalDirective,
  WiPopoverTitleComponent,
  WiPopoverTriggerDirective,
  WiTooltipDirective,
} from '@wiloc/ui/overlays';
import {
  WiBreadcrumbComponent,
  type WiBreadcrumbItem,
  WiStepperComponent,
  WiStepperPanelDirective,
  type WiStepperStep,
  WiTabsComponent,
  WiTabsContentDirective,
  WiTabsListComponent,
  WiTabsTriggerDirective,
} from '@wiloc/ui/navigation';

import { appLocale, toggleAppLocale, uiMessages } from './locale';

/** IDs de pestaña = dominio de la app (la librería no impone claves). */
const ALERT_TAB_IDS = {
  unmanaged: 'alerts-unmanaged',
  managed: 'alerts-managed',
  archived: 'alerts-archived',
} as const;

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
    WiFileUploadComponent,
    WiPopoverCloseDirective,
    WiPopoverComponent,
    WiPopoverContentComponent,
    WiPopoverDescriptionComponent,
    WiPopoverHeaderComponent,
    WiPopoverPortalDirective,
    WiPopoverTitleComponent,
    WiPopoverTriggerDirective,
    WiCheckboxComponent,
    WiIconComponent,
    WiInputComponent,
    WiListboxComponent,
    WiOtpComponent,
    WiPicklistComponent,
    WiSelectComponent,
    WiSwitchComponent,
    WiTableCellDirective,
    WiTableComponent,
    WiBreadcrumbComponent,
    WiStepperComponent,
    WiStepperPanelDirective,
    WiTabsComponent,
    WiTabsContentDirective,
    WiTabsListComponent,
    WiTabsTriggerDirective,
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
  protected readonly otpControl = new FormControl('', { nonNullable: true });
  protected readonly termsControl = new FormControl(false, { nonNullable: true });
  protected readonly notificationsControl = new FormControl(false, { nonNullable: true });
  protected readonly fruit = signal<string | null>(null);
  protected readonly role = signal<string | null>(null);
  protected readonly assignedMembers = signal<string[]>([]);
  protected readonly date = signal<Date | null>(null);
  protected readonly uploadFiles = signal<readonly File[]>([]);
  protected readonly uploadLoading = signal(false);
  protected readonly uploadStatus = signal<string | null>(null);
  protected readonly uploadError = signal<string | null>(null);
  /** 1 MiB — límite de smoke; la app decide la política. */
  protected readonly maxUploadBytes = 1024 * 1024;
  protected readonly uploadFileNames = computed(() => {
    const files = this.uploadFiles();
    return files.length ? files.map((file) => file.name).join(', ') : null;
  });
  protected readonly alertsTab = signal<string>(ALERT_TAB_IDS.unmanaged);
  protected readonly signupStep = signal('details');
  protected readonly tableFilters = signal<readonly WiColumnFilter[]>([]);
  protected readonly tablePageIndex = signal(0);

  /** Tabs de smoke: id + copy los define la app (i18n), no `@wiloc/ui`. */
  protected readonly alertTabs = computed(() => {
    const m = this.t();
    return [
      { id: ALERT_TAB_IDS.unmanaged, label: m.tabUnmanaged, body: m.tabUnmanagedBody },
      { id: ALERT_TAB_IDS.managed, label: m.tabManaged, body: m.tabManagedBody },
      { id: ALERT_TAB_IDS.archived, label: m.tabArchived, body: m.tabArchivedBody },
    ];
  });

  protected readonly crumbClick = signal<string | null>(null);

  protected readonly crumbs = computed((): readonly WiBreadcrumbItem[] => {
    const m = this.t();
    return [
      { id: 'home', label: m.breadcrumbHome, href: '/', icon: 'home', iconOnly: true },
      { id: 'admin', label: m.breadcrumbSection, href: '/administration' },
      { id: 'users', label: m.breadcrumbCurrent },
    ];
  });

  protected onCrumb(item: WiBreadcrumbItem): void {
    this.crumbClick.set(item.id);
  }

  protected readonly signupSteps = computed((): readonly WiStepperStep[] => {
    const m = this.t();
    return [
      { id: 'details', label: m.stepperDetails, icon: 'user' },
      { id: 'apps', label: m.stepperApps, icon: 'squares-2x2' },
      { id: 'summary', label: m.stepperSummary, icon: 'list-bullet' },
    ];
  });

  protected readonly tableColumns = computed((): WiColumnDef[] => {
    const m = this.t();
    return [
      {
        id: 'name',
        header: m.tableColName,
        field: 'name',
        sortable: true,
        filterable: true,
        filterPlaceholder: m.tableFilterName,
        showFrom: 'always',
      },
      {
        id: 'city',
        header: m.tableColCity,
        field: 'city',
        sortable: true,
        filterable: true,
        filterPlaceholder: m.tableFilterCity,
      },
      {
        id: 'status',
        header: m.tableColStatus,
        field: 'status',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterPlaceholder: m.tableFilterStatus,
        filterOptions: m.tableStatusOptions,
      },
    ];
  });

  protected readonly tableRows = computed(() => this.t().tableRows);

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
    this.role.set(null);
    this.assignedMembers.set([]);
    this.uploadFiles.set([]);
    this.uploadStatus.set(null);
    this.uploadError.set(null);
    this.alertsTab.set(ALERT_TAB_IDS.unmanaged);
    this.signupStep.set('details');
    this.tableFilters.set([]);
    this.tablePageIndex.set(0);
  }

  protected onUploadFilesChange(files: readonly File[]): void {
    this.uploadStatus.set(null);
    if (files.length > 0) {
      this.uploadError.set(null);
    }
  }

  protected onUploadReject(rejections: readonly WiFileUploadRejection[]): void {
    const first = rejections[0];
    if (!first) {
      this.uploadError.set(null);
      return;
    }
    this.uploadStatus.set(null);
    this.uploadError.set(
      first.reason === 'size' ? this.t().fileRejectSize : this.t().fileRejectType,
    );
  }

  protected onUpload(files: readonly File[]): void {
    this.uploadError.set(null);
    this.uploadLoading.set(true);
    globalThis.setTimeout(() => {
      this.uploadLoading.set(false);
      const names = files.map((file) => file.name).join(', ');
      this.uploadStatus.set(`${this.t().fileUploaded}: ${names || '—'}`);
    }, 800);
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
