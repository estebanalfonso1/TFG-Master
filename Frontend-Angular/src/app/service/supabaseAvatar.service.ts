import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseServiceAvatar {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://hqmzvfyyuvhturhzxsok.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxbXp2Znl5dXZodHVyaHp4c29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTE4MDYsImV4cCI6MjA2MzIyNzgwNn0._04HpZYsU8Sj_E0mg1MXtOsmqv2dKb_DKTwQxm8iwQg'
    );
  }

  async subirImagen(archivo: File, url: string): Promise<string | null> {

    const { data: imagenSubida, error: error } = await this.supabase.storage
      .from('avatares')
      .upload(url, archivo, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Ha ocurrido un error: ', error);
      return null;
    }

    const { data: urlSupabase } = this.supabase.storage
      .from('avatares')
      .getPublicUrl(url);

    if (!urlSupabase?.publicUrl) {
      console.error('No hay url para la image');
      return null;
    }

    return urlSupabase.publicUrl;
  }

  async eliminarImagen(url: string): Promise<boolean> {
    const { data, error } = await this.supabase.storage
      .from('avatares')
      .remove([url]);

    if (error) {
      console.error('Ha ocurrido un error', error);
      return false;
    }

    return true;
  }
}
