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

    /** Sube un archivo y devuelve solo el path si sube correctamente, o null si hay error */
    async uploadArchivo(file: File, path: string): Promise<string | null> {
        console.log('[SupabaseService] Subiendo a:', path, 'archivo:', file);

        const { data: uploadData, error: uploadError } = await this.supabase.storage
            .from('archivos')
            .upload(path, file, {
                cacheControl: '3600',
                upsert: true,
            });

        console.log('[SupabaseService] uploadData:', uploadData, 'uploadError:', uploadError);
        if (uploadError) {
            console.error('[SupabaseService] Error al subir archivo:', uploadError);
            return null;
        }

        // Retornamos solo el path para guardar en la base de datos
        return path;
    }

    /** Dado un path, devuelve la URL firmada para acceder al archivo (válida 1 hora) */
    async getSignedUrl(path: string): Promise<string | null> {
        if (!path) return null;

        const { data, error } = await this.supabase.storage
            .from('archivos')
            .createSignedUrl(path, 60 * 60); // 1 hora

        if (error || !data?.signedUrl) {
            console.error('[SupabaseService] Error al obtener signedUrl:', error);
            return null;
        }

        return data.signedUrl;
    }

    async deleteArchivo(path: string): Promise<boolean> {
        console.log('[SupabaseService] Eliminando:', path);
        const { data, error } = await this.supabase.storage
            .from('archivos')
            .remove([path]);

        if (error) {
            console.error('[SupabaseService] Error al eliminar archivo:', error);
            return false;
        }

        console.log('[SupabaseService] Archivo eliminado:', data);
        return true;
    }
}
