import { RaftOtelWebModule } from 'projects/raft-otel-web/src/lib/raft-otel-web.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { OpenTelemetryConfig } from 'projects/raft-otel-web/src/lib/utils/otel-config';
import { INGXLoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { DiagLogLevel } from '@opentelemetry/api';

interface IEnvironment {
  production: boolean;
  urlTest: string;
  openTelemetryConfig: OpenTelemetryConfig;
  loggerConfig: INGXLoggerConfig;
}

// Example to configure the angular-interceptor library
export const environment: IEnvironment = {
  production: false,
  urlTest: 'http://localhost:4200/api',
  openTelemetryConfig: {
    commonConfig: {
      console: true, // Display trace on console
      production: true, // Send Trace with BatchSpanProcessor (true) or SimpleSpanProcessor (false)
      serviceName: 'interceptor-example', // Service name send in trace
      logBody: true, // true add body in a log, nothing otherwise
      probabilitySampler: '1', // 75% sampling
      logLevel: DiagLogLevel.ALL, //ALL Log, DiagLogLevel is an Enum from @opentelemetry/api
    },
    otelcolConfig: {
      url: 'http://192.168.10.106:4318/v1/traces', // URL of opentelemetry collector
      timeoutMillis: '10000',
    },
  },
  loggerConfig: {
    level: NgxLoggerLevel.DEBUG,
    disableConsoleLogging: false,
  },
};
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RaftOtelWebModule.forRoot(environment.openTelemetryConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
