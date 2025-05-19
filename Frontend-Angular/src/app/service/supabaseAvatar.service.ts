import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://hqmzvfyyuvhturhzxsok.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxbXp2Znl5dXZodHVyaHp4c29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTE4MDYsImV4cCI6MjA2MzIyNzgwNn0._04HpZYsU8Sj_E0mg1MXtOsmqv2dKb_DKTwQxm8iwQg'
    );
  }

  /** Sube un archivo y devuelve la URL pública o null si hay error */
  async uploadImage(file: File, path: string): Promise<string | null> {
    console.log('[SupabaseService] Subiendo a:', path, 'archivo:', file);

    // 1) Upload
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('avatares')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    console.log('[SupabaseService] uploadData:', uploadData, 'uploadError:', uploadError);
    if (uploadError) {
      console.error('[SupabaseService] Error al subir imagen:', uploadError);
      return null;
    }

    // 2) Obtener URL pública
    // getPublicUrl devuelve { data: { publicUrl: string } }
    const { data: publicUrlData } = this.supabase.storage
      .from('avatares')
      .getPublicUrl(path);

    if (!publicUrlData?.publicUrl) {
      console.error('[SupabaseService] No se obtuvo publicUrl para:', path);
      return null;
    }

    console.log('[SupabaseService] publicUrl:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  }

  async deleteImage(path: string): Promise<boolean> {
    console.log('[SupabaseService] Eliminando:', path);
    const { data, error } = await this.supabase.storage
      .from('avatares')
      .remove([path]);

    if (error) {
      console.error('[SupabaseService] Error al eliminar imagen:', error);
      return false;
    }

    console.log('[SupabaseService] Imagen eliminada:', data);
    return true;
  }
}
