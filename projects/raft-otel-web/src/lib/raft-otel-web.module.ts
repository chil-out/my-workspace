import {
  ClassProvider,
  ConstructorProvider,
  ExistingProvider,
  FactoryProvider,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  ValueProvider,
} from '@angular/core';
import { RaftOtelTracerService } from './service/raft-otel-tracer.service';
import { defineConfigProvider, OpenTelemetryConfig } from './utils/otel-config';
@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class RaftOtelWebModule {
  constructor(@Optional() @SkipSelf() parentModule: RaftOtelWebModule) {
    if (parentModule) {
      throw new Error(
        'RaftOtelWebModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  public static forRoot(
    config: OpenTelemetryConfig | null | undefined,
    configProvider:
      | ValueProvider
      | ClassProvider
      | ConstructorProvider
      | ExistingProvider
      | FactoryProvider
  ): ModuleWithProviders<RaftOtelWebModule> {
    configProvider = defineConfigProvider(config, configProvider);

    return {
      ngModule: RaftOtelWebModule,
      providers: [configProvider, RaftOtelTracerService],
    };
  }
}
