import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

export interface ChatMessage {
  id: number;
  usuario_id: string;
  nombre_usuario: string;
  mensaje: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  async getMessages(): Promise<ChatMessage[]> {
    const { data, error } = await this.supabaseService.client
      .from('mensajes_chat')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error obteniendo mensajes:', error);
      throw new Error('No se pudieron cargar los mensajes.');
    }

    return data || [];
  }

  async sendMessage(message: string) {
    const profile = await this.authService.getCurrentUserProfile();

    if (!profile) {
      throw new Error('No hay usuario logueado.');
    }

    const { error } = await this.supabaseService.client
      .from('mensajes_chat')
      .insert({
        usuario_id: profile.id,
        nombre_usuario: profile.nombre || profile.email,
        mensaje: message
      });

    if (error) {
      console.error('Error enviando mensaje:', error);
      throw new Error('No se pudo enviar el mensaje.');
    }
  }

  subscribeToMessages(callback: (message: ChatMessage) => void) {
    return this.supabaseService.client
      .channel('mensajes_chat_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes_chat'
        },
        payload => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();
  }

  unsubscribe(channel: any) {
    if (channel) {
      this.supabaseService.client.removeChannel(channel);
    }
  }
}