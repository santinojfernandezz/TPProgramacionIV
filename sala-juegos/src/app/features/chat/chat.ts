import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
  messages: ChatMessage[] = [];
  newMessage = '';
  currentUserId = '';
  errorMessage = '';
  loading = true;
  sending = false;
  channel: any = null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.loadChat();

    this.channel = this.chatService.subscribeToMessages((message) => {
      this.messages = [...this.messages, message];
    });
  }

  async loadChat() {
    try {
      const user = await this.authService.getCurrentUser();

      if (user) {
        this.currentUserId = user.id;
      }

      this.messages = await this.chatService.getMessages();
    } catch (error: any) {
      this.errorMessage = error.message || 'No se pudo cargar el chat.';
    } finally {
      this.loading = false;
    }
  }

  async sendMessage() {
    const message = this.newMessage.trim();

    if (!message || this.sending) {
      return;
    }

    this.sending = true;
    this.errorMessage = '';

    try {
      await this.chatService.sendMessage(message);
      this.newMessage = '';
    } catch (error: any) {
      this.errorMessage = error.message || 'No se pudo enviar el mensaje.';
    } finally {
      this.sending = false;
    }
  }

  isOwnMessage(message: ChatMessage): boolean {
    return message.usuario_id === this.currentUserId;
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