import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiFileUploadComponent } from '../../forms/src/file-upload/wi-file-upload.component';
import type { WiFileUploadSize } from '../../forms/src/file-upload/wi-file-upload.types';

describe('WiFileUploadComponent', () => {
  let fixture: ComponentFixture<WiFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiFileUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiFileUploadComponent);
    fixture.componentRef.setInput('chooseLabel', 'Elegir archivo');
    fixture.componentRef.setInput('emptyLabel', 'Ningún archivo seleccionado');
    fixture.componentRef.setInput('uploadLabel', 'Subir');
    fixture.componentRef.setInput('ariaLabel', 'Archivo');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function nativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[type="file"]');
  }

  function chooseButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.wi-file-upload__choose button');
  }

  function uploadButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.wi-file-upload__upload button');
  }

  function filename(): HTMLElement {
    return fixture.nativeElement.querySelector('.wi-file-upload__filename');
  }

  function selectFiles(files: File[]): void {
    const input = nativeInput();
    const fileList = {
      length: files.length,
      item: (index: number) => files[index] ?? null,
      *[Symbol.iterator]() {
        yield* files;
      },
    } as FileList;
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: fileList,
    });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  it('renders the host, choose control and empty label', () => {
    expect(fixture.nativeElement.classList.contains('wi-file-upload')).toBe(true);
    expect(fixture.nativeElement.getAttribute('role')).toBe('group');
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe('Archivo');
    expect(chooseButton().textContent?.trim()).toBe('Elegir archivo');
    expect(filename().textContent?.trim()).toBe('Ningún archivo seleccionado');
    expect(nativeInput().className).toContain('sr-only');
    expect(nativeInput().getAttribute('aria-hidden')).toBe('true');
  });

  it('exposes a stable id for label association', () => {
    expect(nativeInput().id).toMatch(/^wi-file-upload-\d+$/);

    fixture.componentRef.setInput('id', 'certs');
    fixture.detectChanges();
    expect(nativeInput().id).toBe('certs');
  });

  it.each([
    ['sm', 'h-control-sm'],
    ['md', 'h-control-md'],
    ['lg', 'h-control-lg'],
  ] as const satisfies readonly (readonly [WiFileUploadSize, string])[])(
    'applies %s size classes to choose and upload',
    (size, heightClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(chooseButton().className).toContain(heightClass);
      expect(uploadButton()?.className).toContain(heightClass);
    },
  );

  it('applies accept, name, multiple and required on the native input', () => {
    fixture.componentRef.setInput('accept', '.xlsx');
    fixture.componentRef.setInput('name', 'certFile');
    fixture.componentRef.setInput('multiple', true);
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const el = nativeInput();
    expect(el.getAttribute('accept')).toBe('.xlsx');
    expect(el.getAttribute('name')).toBe('certFile');
    expect(el.multiple).toBe(true);
    expect(el.required).toBe(true);
    expect(fixture.nativeElement.getAttribute('aria-required')).toBe('true');
  });

  it('disables choose, upload and native input when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(chooseButton().disabled).toBe(true);
    expect(uploadButton()?.disabled).toBe(true);
    expect(nativeInput().disabled).toBe(true);
    expect(fixture.nativeElement.getAttribute('aria-disabled')).toBe('true');
  });

  it('marks invalid via aria-invalid on the group', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('ariaDescribedBy', 'file-error');
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.getAttribute('aria-describedby')).toBe('file-error');
  });

  it('keeps upload disabled until a file is selected', () => {
    expect(uploadButton()?.disabled).toBe(true);

    const file = new File(['data'], 'report.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    selectFiles([file]);

    expect(uploadButton()?.disabled).toBe(false);
    expect(filename().textContent?.trim()).toBe('report.xlsx');
    expect(fixture.componentInstance.files()).toEqual([file]);
  });

  it('emits touch when files are selected', () => {
    const touchSpy = vi.fn();
    fixture.componentInstance.touch.subscribe(touchSpy);

    selectFiles([new File(['a'], 'a.csv', { type: 'text/csv' })]);
    expect(touchSpy).toHaveBeenCalledTimes(1);
  });

  it('emits upload with the selected files', () => {
    const uploadSpy = vi.fn();
    fixture.componentInstance.upload.subscribe(uploadSpy);

    const file = new File(['data'], 'import.csv', { type: 'text/csv' });
    selectFiles([file]);
    uploadButton()?.click();

    expect(uploadSpy).toHaveBeenCalledTimes(1);
    expect(uploadSpy).toHaveBeenCalledWith([file]);
  });

  it('does not emit upload when there are no files', () => {
    const uploadSpy = vi.fn();
    fixture.componentInstance.upload.subscribe(uploadSpy);
    uploadButton()?.click();
    expect(uploadSpy).not.toHaveBeenCalled();
  });

  it('lists multiple file names', () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();

    selectFiles([
      new File(['a'], 'one.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['b'], 'two.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ]);

    expect(filename().textContent?.trim()).toBe('one.xlsx, two.xlsx');
    expect(fixture.componentInstance.files().length).toBe(2);
  });

  it('hides the upload button when showUpload is false', () => {
    fixture.componentRef.setInput('showUpload', false);
    fixture.detectChanges();
    expect(uploadButton()).toBeNull();
  });

  it('sets loading on the upload button', () => {
    const file = new File(['data'], 'report.xlsx');
    selectFiles([file]);
    fixture.componentRef.setInput('uploadLoading', true);
    fixture.detectChanges();

    expect(uploadButton()?.getAttribute('aria-busy')).toBe('true');
    expect(uploadButton()?.disabled).toBe(true);
  });

  it('opens the native picker from the choose button', () => {
    const clickSpy = vi.spyOn(nativeInput(), 'click');
    chooseButton().click();
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('clears the native input value so the same file can be reselected', () => {
    const file = new File(['data'], 'same.xlsx');
    selectFiles([file]);
    expect(nativeInput().value).toBe('');
  });

  it('rejects files that do not match accept and keeps valid ones', () => {
    const rejectSpy = vi.fn();
    fixture.componentInstance.reject.subscribe(rejectSpy);
    fixture.componentRef.setInput('accept', '.xlsx,.csv');
    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();

    const ok = new File(['a'], 'ok.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const bad = new File(['b'], 'bad.pdf', { type: 'application/pdf' });
    selectFiles([ok, bad]);

    expect(fixture.componentInstance.files()).toEqual([ok]);
    expect(rejectSpy).toHaveBeenCalledTimes(1);
    expect(rejectSpy.mock.calls[0][0]).toEqual([{ file: bad, reason: 'type' }]);
  });

  it('rejects files over maxFileSize', () => {
    const rejectSpy = vi.fn();
    fixture.componentInstance.reject.subscribe(rejectSpy);
    fixture.componentRef.setInput('maxFileSize', 4);
    fixture.detectChanges();

    const tooBig = new File(['12345'], 'big.csv', { type: 'text/csv' });
    selectFiles([tooBig]);

    expect(fixture.componentInstance.files()).toEqual([]);
    expect(filename().textContent?.trim()).toBe('Ningún archivo seleccionado');
    expect(rejectSpy).toHaveBeenCalledWith([{ file: tooBig, reason: 'size' }]);
  });

  it('accepts MIME wildcards and exact types', () => {
    fixture.componentRef.setInput('accept', 'image/*,text/csv');
    fixture.detectChanges();

    const png = new File(['x'], 'photo.png', { type: 'image/png' });
    selectFiles([png]);
    expect(fixture.componentInstance.files()).toEqual([png]);
  });
});
