import { Injectable } from '@angular/core';

export interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

const SIMULATED_LATENCY_MS = 600;

@Injectable({ providedIn: 'root' })
export class ContactService {
  async send(_message: ContactMessage): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  }
}
