// app.ts  --------------------------------------------------------------
import {
  httpResource,
  HttpResourceRequest,
  HttpResourceOptions,
  HttpResourceRef,
  HttpContext,
} from '@angular/common/http';
import {Component, Injector, inject, effect, signal} from '@angular/core';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import {MatProgressBar} from '@angular/material/progress-bar';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [],
  templateUrl: './app.html',
  imports: [
    MatCardModule, MatButtonModule, MatProgressBar
  ],
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'sample-project';

  constructor() {
    effect(() => {
      console.log('hasValue     ➜', this.postsResource.hasValue());
      console.log('[isLoading]  ➜', this.postsResource.isLoading());
      console.log('[error]      ➜', this.postsResource.error());
      console.log('[value]      ➜', this.postsResource.value());
      console.log('[progress]   ➜', this.postsResource.progress());
      console.log('[status]     ➜', this.postsResource.status());
    });
  }

  readonly selectedUserId = signal<number | undefined>(undefined);

  private postsRequest = (): HttpResourceRequest | undefined => {
    const uid = this.selectedUserId();
    if (uid === undefined) return undefined;            // ← stay idle
    /*
      hasValue     ➜ true
      [isLoading]  ➜ false
      [error]      ➜ undefined
      [value]      ➜ []
      [progress]   ➜ undefined
      [status]     ➜ idle
    */
    return {
      url: `https://jsonplaceholder.typicode.com/posts`,
      method: 'GET',
      params: { userId: uid },
      headers: { Accept: 'application/json' } as const,
      context: new HttpContext(),
      reportProgress: false,
      withCredentials: false,
      transferCache: false,
    };
  };

  private postsOptions = {
    defaultValue: [] as Post[],
    parse: (raw): Post[] => raw as Post[],
    injector: inject(Injector),
  } satisfies HttpResourceOptions<Post[], unknown>;

  /** 3️⃣— the resource */
  readonly postsResource: HttpResourceRef<Post[]> =
    httpResource<Post[]>(this.postsRequest, this.postsOptions);

  readonly postsResource2: HttpResourceRef<Post[]> =
    httpResource<Post[]>(this.postsRequest, {
      defaultValue: [] as Post[],
      parse: (raw): Post[] => raw as Post[],
      injector: inject(Injector),
    });
}


