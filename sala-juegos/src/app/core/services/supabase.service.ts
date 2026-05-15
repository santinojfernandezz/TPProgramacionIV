import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabaseUrl = 'https://cwbsladbweqddqjzzdgy.supabase.co';
  private supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3YnNsYWRid2VxZGRxanp6ZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NTM4MTIsImV4cCI6MjA5NDQyOTgxMn0.YDzoBp8MXAB-k0CF9Qi3-WxnrnsHvTyptORSryHSKCY';

  public client: SupabaseClient;

  constructor() {
    this.client = createClient(this.supabaseUrl, this.supabaseAnonKey);
  }
}