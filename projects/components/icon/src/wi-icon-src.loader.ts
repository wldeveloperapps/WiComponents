import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { parseExternalSvg, type WiParsedExternalIcon } from './wi-icon.svg';

export type WiIconSrcFailure = 'client' | 'http' | 'parse';

export type WiIconSrcResult =
  | { readonly ok: true; readonly icon: WiParsedExternalIcon }
  | { readonly ok: false; readonly kind: WiIconSrcFailure };

interface CachedSvgText {
  readonly status: 'ok';
  readonly text: string;
}

interface CachedSvgError {
  readonly status: 'error';
  readonly kind: 'client' | 'http';
}

type CachedSvg = CachedSvgText | CachedSvgError;

/**
 * Descarga el texto SVG de `src` una sola vez por URL.
 * La caché es compartida por todas las instancias, también mientras la petición está en vuelo.
 */
@Service()
export class WiIconSrcLoader {
  private readonly http = inject(HttpClient, { optional: true });
  private readonly cache = new Map<string, Promise<CachedSvg>>();

  loadIcon(url: string, preserveColors: boolean): Promise<WiIconSrcResult> {
    return this.loadText(url).then((cached) => {
      if (cached.status === 'error') {
        return { ok: false as const, kind: cached.kind };
      }

      const icon = parseExternalSvg(cached.text, preserveColors);
      if (!icon) {
        return { ok: false as const, kind: 'parse' as const };
      }

      return { ok: true as const, icon };
    });
  }

  private loadText(url: string): Promise<CachedSvg> {
    const cached = this.cache.get(url);
    if (cached) {
      return cached;
    }

    const pending = this.requestText(url);
    this.cache.set(url, pending);
    return pending;
  }

  private requestText(url: string): Promise<CachedSvg> {
    const http = this.http;
    if (!http) {
      return Promise.resolve({ status: 'error', kind: 'client' });
    }

    return firstValueFrom(http.get(url, { responseType: 'text' }))
      .then((text): CachedSvg => ({ status: 'ok', text }))
      .catch((): CachedSvg => ({ status: 'error', kind: 'http' }));
  }
}
