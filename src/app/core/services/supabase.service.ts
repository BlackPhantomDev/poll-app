import { Service } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { environment } from '../../../environments/environment';

@Service()
export class SupabaseService {
  private instance: SupabaseClient | null = null;

  get client(): SupabaseClient {
    if (this.instance === null) {
      this.instance = this.createInstance();
    }

    return this.instance;
  }

  private createInstance(): SupabaseClient {
    const { supabaseUrl, supabaseAnonKey } = environment;

    if (supabaseUrl === '' || supabaseAnonKey === '') {
      throw new Error(
        'Supabase ist nicht konfiguriert. supabaseUrl und supabaseAnonKey in src/environments/environment.ts eintragen (Vorlage: environment.example.ts).',
      );
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
}
