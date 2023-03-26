import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { OpenTelemetryConfig, OTEL_CONFIG } from './utils/otel-config';
@NgModule({})
export class RaftOtelWebModule {
  constructor(@Optional() @SkipSelf() parentModule: RaftOtelWebModule) {
    if (parentModule) {
      throw new Error(
        'RaftOtelWebModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  public static forRoot(
    config: OpenTelemetryConfig
  ): ModuleWithProviders<RaftOtelWebModule> {
    return {
      ngModule: RaftOtelWebModule,
      providers: [{ provide: 'opentelemetry.config', useValue: config }],
    };
  }
}
