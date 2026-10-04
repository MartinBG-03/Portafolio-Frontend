import { HttpParams } from '@angular/common/http';

export type HttpParamValue = string | number | boolean | null | undefined;

export function buildHttpParams(values: Readonly<Record<string, HttpParamValue>>): HttpParams {
  let params = new HttpParams();

  for (const [key, value] of Object.entries(values)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }
    params = params.set(key, String(value));
  }

  return params;
}
