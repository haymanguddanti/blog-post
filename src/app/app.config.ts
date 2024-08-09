import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authHttpInterceptorFn } from '@auth0/auth0-angular';

import { routes } from './app.routes';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAuth0({
      domain: 'dev-ghal76y5w8xaqbwb.us.auth0.com',
      clientId: 'tDYj0jAp0921MbjBilWkRG11fqHYiGVI',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
    // provideAuth0({
    //   domain: 'dev-ghal76y5w8xaqbwb.us.auth0.com',
    //   clientId: 'tDYj0jAp0921MbjBilWkRG11fqHYiGVI',
    //   authorizationParams: {
    //     redirect_uri: window.location.origin,

    //     audience: 'https://dev-ghal76y5w8xaqbwb.us.auth0.com/api/v2/',

    //     scope: 'read:current_user',
    //   },
    //   httpInterceptor: {
    //     allowedList: [
    //       {
    //         uri: 'https://dev-ghal76y5w8xaqbwb.us.auth0.com/api/v2/*',
    //         tokenOptions: {
    //           authorizationParams: {
    //             audience: 'https://dev-ghal76y5w8xaqbwb.us.auth0.com/api/v2/',
    //             scope: 'read:current_user',
    //           },
    //         },
    //       },
    //     ],
    //   },
    // }),
  ],
};
