import * as cdk from '@aws-cdk/core';

export interface Term {
  duration: string;
  operator: string;
  priority: string;
  threshold: string;
  timeFunction: string;
}

export interface NrqlAlertProps {
  apiKey: cdk.SecretValue;
  policyId: number;
  terms?: Term[];
  enabled: boolean;
  name: string;
  id: number;
  type: string;
  runbookUrl: string;
  expectedGroups: number;
  ignoreOverlap: boolean;
  valueFunction: string;
  query: string;
  sinceValue: string;
}

export class NrqlAlert extends cdk.Construct {
  private readonly terms: Term[];

  constructor(scope: cdk.Construct, id: string, props: NrqlAlertProps) {
    super(scope, id);

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
      Operator: term.operator,
      Priority: term.priority,
      Threshold: term.threshold,
      TimeFunction: term.timeFunction
    }
  }
}
