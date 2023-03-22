import { Inject, Injectable } from '@angular/core';
import {
  Sampler,
  AlwaysOffSampler,
  AlwaysOnSampler,
  BatchSpanProcessor,
  ConsoleSpanExporter,
  ParentBasedSampler,
  SimpleSpanProcessor,
  TraceIdRatioBasedSampler,
  WebTracerProvider,
} from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import {
  InstrumentationOption,
  registerInstrumentations,
} from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';

const {
  getWebAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-web');

import {
  OTEL_CONFIG,
  OpenTelemetryConfig,
  OTEL_INSTRUMENTATION_PLUGINS,
} from '../utils/otel-config';

@Injectable({
  providedIn: 'root',
})
export class RaftOtelTracerService {
  /**
   * tracerProvider
   */
  private tracerProvider: WebTracerProvider;

  /**
   * contextManager
   */
  private contextManager = new ZoneContextManager();

  constructor(
    @Inject(OTEL_CONFIG) private config: OpenTelemetryConfig,
    // @Inject(OTEL_EXPORTER)
    // private exporterService: IExporter,
    // @Inject(OTEL_PROPAGATOR)
    // private propagatorService: IPropagator,
    @Inject(OTEL_INSTRUMENTATION_PLUGINS)
    private instrumentationOptions: InstrumentationOption[]
  ) {
    console.log('this is otel service');
    const exporter = new OTLPTraceExporter({
      url: 'https:192.168.10.106:443/v1/traces',
    });
    this.tracerProvider = new WebTracerProvider({
      sampler: this.defineProbabilitySampler(
        this.convertStringToNumber(this.config.commonConfig.probabilitySampler)
      ),
      resource: Resource.default().merge(
        new Resource({
          [SemanticResourceAttributes.SERVICE_NAME]:
            this.config.commonConfig.serviceName,
        })
      ),
    });

    this.tracerProvider.addSpanProcessor(new BatchSpanProcessor(exporter));
    this.tracerProvider.addSpanProcessor(
      new SimpleSpanProcessor(new ConsoleSpanExporter())
    );

    this.tracerProvider.register({
      contextManager: new ZoneContextManager(),
    });

    registerInstrumentations({
      instrumentations: [
        getWebAutoInstrumentations({
          // load custom configuration for xml-http-request instrumentation
          '@opentelemetry/instrumentation-xml-http-request': {
            propagateTraceHeaderCorsUrls: [
              /token/g, //Regex to match your backend urls. This should be updated.
            ],
          },
          '@opentelemetry/instrumentation-fetch': {
            propagateTraceHeaderCorsUrls: [
              /.+/g, //Regex to match your backend urls. This should be updated.
            ],
          },
          '@opentelemetry/instrumentation-document-load': {},
          '@opentelemetry/instrumentation-user-interaction': {
            enabled: true,
            eventNames: ['click', 'submit', 'keypress'],
            // shouldPreventSpanCreation: (event, element, span) => {
            //   span.setAttribute('target.id', element.id);
            // },
          },
        }),
      ],
    });
  }

  private defineProbabilitySampler(sampleConfig: number): Sampler {
    if (sampleConfig >= 1) {
      return new ParentBasedSampler({ root: new AlwaysOnSampler() });
    } else if (sampleConfig <= 0 || sampleConfig === undefined) {
      return new ParentBasedSampler({ root: new AlwaysOffSampler() });
    } else {
      return new ParentBasedSampler({
        root: new TraceIdRatioBasedSampler(sampleConfig),
      });
    }
  }
  private convertStringToNumber(value: string): number {
    return value !== undefined ? Number(value) : 0.75;
  }
}
