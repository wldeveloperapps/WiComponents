export type WiFileUploadSize = 'sm' | 'md' | 'lg';

/** Motivo por el que un archivo no pasa la validación del control. */
export type WiFileUploadRejectReason = 'type' | 'size';

export interface WiFileUploadRejection {
  file: File;
  reason: WiFileUploadRejectReason;
}

/**
 * Comprueba si el archivo encaja con un `accept` estilo HTML
 * (extensiones `.xlsx`, MIME `image/png` o comodines `image/*`).
 * Cadena vacía = cualquier tipo.
 */
export function isFileAccepted(file: File, accept: string): boolean {
  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length > 0);

  if (tokens.length === 0) {
    return true;
  }

  const fileName = file.name.toLowerCase();
  const mime = (file.type || '').toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith('.')) {
      return fileName.endsWith(token);
    }
    if (token.endsWith('/*')) {
      const prefix = token.slice(0, -1);
      return mime.startsWith(prefix);
    }
    return mime === token;
  });
}

/** `maxFileSize` en bytes; `null` / `undefined` / NaN / ≤0 = sin límite. */
export function isFileWithinSize(file: File, maxFileSize: number | null | undefined): boolean {
  if (maxFileSize == null || !Number.isFinite(maxFileSize) || maxFileSize <= 0) {
    return true;
  }
  return file.size <= maxFileSize;
}
