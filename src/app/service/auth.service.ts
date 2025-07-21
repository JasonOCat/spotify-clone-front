import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpStatusCode} from '@angular/common/http';
import {User} from './model/user.model';
import {State} from './model/state.model';
import {environment} from '../../environments/environment';
import {Location} from '@angular/common';


export type AuthPopupState = "OPEN" | "CLOSE"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient)

  location = inject(Location);

  notConnected = 'NOT_CONNECTED';

  private fetchUserSignal = signal(State.onSuccess(State.onInit<User, HttpErrorResponse>(), {email: this.notConnected}));
  fetchUser = computed(() => this.fetchUserSignal())

  private triggerAuthPopupSignal: WritableSignal<AuthPopupState> = signal("CLOSE");
  authPopupStateChange = computed(() => this.triggerAuthPopupSignal());


  fetch(): void {
    this.http.get<User>(`${environment.API_URL}/api/get-authenticated-user`)
      .subscribe({
        next: user => this.fetchUserSignal.update(state => State.onSuccess(state, user)),
        error: (err: HttpErrorResponse) => {
          if (err.status === HttpStatusCode.Unauthorized && !this.isAuthenticated()) {
            this.fetchUserSignal.update(state => State.onSuccess(state, {email: this.notConnected}));
          } else {
            this.fetchUserSignal.update(state => State.onError(state, err));
          }
        }
      })
  }

  constructor() {
  }

  isAuthenticated(): boolean {
    if (this.fetchUserSignal().value) {
      return this.fetchUserSignal().value!.email !== this.notConnected;
    } else {
      return false;
    }
  }

  login(): void {
    location.href = `${location.origin}${this.location.prepareExternalUrl('oauth2/authorization/okta')}`;
  }

  logout(): void {
    this.http.post(`${environment.API_URL}/api/logout`, {}, {withCredentials: true})
      .subscribe({
        next: (response: any) => {
          this.fetchUserSignal.update(state => State.onSuccess(state, {email: this.notConnected}));
          location.href = response.logoutUrl
        }
      })
  }

  openOrCloseAuthPopup(state: AuthPopupState) {
    this.triggerAuthPopupSignal.set(state);
  }

}
