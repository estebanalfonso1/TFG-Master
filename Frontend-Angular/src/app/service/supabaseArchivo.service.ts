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

    async subirArchivo(archivo: File, url: string): Promise<string | null> {

        const { data: archivoSubido, error: error } = await this.supabase.storage
            .from('archivos')
            .upload(url, archivo, {
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            console.error('Ha ocurrido un error: ', error);
            return null;
        }

        return url;
    }

    async obtenerUrlSupabase(url: string): Promise<string | null> {
        if (!url) return null;

        const { data, error } = await this.supabase.storage
            .from('archivos')
            .createSignedUrl(url, 60 * 60);

        if (error || !data?.signedUrl) {
            console.error('Ha ocurrido un error:', error);
            return null;
        }

        return data.signedUrl;
    }

    async eliminarArchivo(url: string): Promise<boolean> {
        console.log('Eliminando archivo:', url);
        const { data, error } = await this.supabase.storage
            .from('archivos')
            .remove([url]);

        if (error) {
            console.error('Ha ocurrido un error:', error);
            return false;
        }

        console.log('Archivo eliminado');
        return true;
    }
}
