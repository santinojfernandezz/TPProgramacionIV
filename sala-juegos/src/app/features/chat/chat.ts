import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ChatMessage, ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements OnInit, OnDestroy {

  messages = signal<ChatMessage[]>([]);
  newMessage = signal<string>('');
  currentUserId = signal<string>('');
  errorMessage = signal<string>('');
  loading = signal<boolean>(true);
  sending = signal<boolean>(false);

  channel: any = null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.loadChat();

    this.channel = this.chatService.subscribeToMessages((message) => {
      this.messages.update((currentMessages) => [
        ...currentMessages,
        message
      ]);
    });
  }

  async loadChat() {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const user = await this.authService.getCurrentUser();

      if (user) {
        this.currentUserId.set(user.id);
      }

      const loadedMessages = await this.chatService.getMessages();
      this.messages.set(loadedMessages);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'No se pudo cargar el chat.');
    } finally {
      this.loading.set(false);
    }
  }

  async sendMessage() {
    const message = this.newMessage().trim();

    if (!message || this.sending()) {
      return;
    }

    this.sending.set(true);
    this.errorMessage.set('');

    try {
      await this.chatService.sendMessage(message);
      this.newMessage.set('');
    } catch (error: any) {
      this.errorMessage.set(error.message || 'No se pudo enviar el mensaje.');
    } finally {
      this.sending.set(false);
    }
  }

  updateNewMessage(value: string) {
    this.newMessage.set(value);
  }

  isOwnMessage(message: ChatMessage): boolean {
    return message.usuario_id === this.currentUserId();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  ngOnDestroy() {
    this.chatService.unsubscribe(this.channel);
  }
}