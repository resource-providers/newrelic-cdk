import * as cdk from '@aws-cdk/core';

export interface Term {
  duration: string;
  operator: string;
  priority: string;
  threshold: string;
  timeFunction: string;
}

export interface NrqlAlertProps {
  apiKey: cdk.Secret;
  policyId: number;
  terms?: Term[];
  enabled: boolean;
  name: string;
  name: string;
  id: number;
  type: string;
  runbookUrl: string;
  enabled: boolean;
  expectedGroups: number;
  ignoreOverlap: boolean;
  valueFunction: string;
  query: string;
  sinceValue: string;
}

export class NrqlAlert extends cdk.Construct {
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
          Terms: props.terms.map(this.addTerm),
          Nrql: {
            Query: props.query,
            SinceValue: props.sinceValue
          }
        }
      }
    });
  }
  
  public addTerm(term: Term) {
    return {
      Duration: term.duration,
      Operator: term.operator,
      Priority: term.priority,
      Threshold: term.threshold,
      TimeFunction: term.timeFunction
    }
  }
}
