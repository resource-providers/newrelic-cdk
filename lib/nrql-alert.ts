import * as cdk from '@aws-cdk/core';

export interface Term {
  readonly duration: string;
  readonly termOperator: string;
  readonly priority: string;
  readonly threshold: string;
  readonly timeFunction: string;
}

export interface NrqlAlertProps {
  readonly apiKey: cdk.SecretValue;
  readonly policyId: number;
  readonly terms?: Term[];
  readonly enabled: boolean;
  readonly name: string;
  readonly id: number;
  readonly type?: string;
  readonly runbookUrl: string;
  readonly expectedGroups: number;
  readonly ignoreOverlap: boolean;
  readonly valueFunction: string;
  readonly query: string;
  readonly sinceValue: string;
}

export interface INrqlAlert extends cdk.IResource {};

export class NrqlAlert extends cdk.Resource implements INrqlAlert {
  private readonly terms: Term[] = [];

  constructor(scope: cdk.Construct, id: string, props: NrqlAlertProps) {
    super(scope, id, {
      physicalName: props.name,
    });

    new cdk.CfnResource(this, 'Resource', {
      type: 'NewRelic::Alerts::NrqlAlert',
      properties: {
        ApiKey: props.apiKey,
        PolicyId: props.policyId,
        NrqlCondition: {
          Name: props.name,
          Id: props,
          Type: props.type,
          RunbookUrl: props.runbookUrl,
          Enabled: props.enabled,
          ExpectedGroups: props.expectedGroups,
          IgnoreOverlap: props.ignoreOverlap,
          ValueFunction: props.valueFunction,
          Terms: cdk.Lazy.anyValue({ produce: () => this.renderTerms() }),
          Nrql: {
            Query: props.query,
            SinceValue: props.sinceValue
          }
        }
      }
    });

    if (props.terms) {
      this.addTerms(...props.terms);
    }
  }

  public addTerms(...terms: Term[]) {
    this.terms.push(...terms);
  }

  private renderTerms() {
    return this.terms.map(this.createTerm)
  }

  private createTerm(term: Term) {
    return {
      Duration: term.duration,
      Operator: term.termOperator,
      Priority: term.priority,
      Threshold: term.threshold,
      TimeFunction: term.timeFunction
    }
  }
}
