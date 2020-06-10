import * as cdk from '@aws-cdk/core';

export interface Term {
  duration: string;
  operator: string;
  priority: string;
  threshold: string;
  timeFunction: string;
}

export interface Nrql {
  query: string;
  sinceValue: string;
}

export interface NrqlCondition {
  name: string;
  id: number;
  type: string;
  runbookUrl: string;
  enabled: boolean;
  expectedGroups: number;
  ignoreOverlap: boolean;
  valueFunction: string;
  terms: Term[];
  nrql: Nrql;
}

export interface NrqlAlertProps {
  apiKey: cdk.Secret;
  policyId: number;
  nrlqCondition: NrqlCondition;
}

export class NrqlAlert extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: NrqlAlertProps) {
    super(scope, id);
    
    const condition = props.nrqlCondition;
    new cdk.CfnResource(this, 'Resource', {
      type: 'NewRelic::Alerts::NrqlAlert',
      properties: {
        ApiKey: props.apiKey,
        PolicyId: props.policyId,
        NrqlCondition: {
          Name: condition.name,
          Id: condition.id,
          Type: condition.type,
          RunbookUrl: condition.runbookUrl,
          Enabled: condition.enabled,
          ExpectedGroups: condition.expectedGroups,
          IgnoreOverlap: condition.ignoreOverlap,
          ValueFunction: condition.valueFunction,
          Terms: condition.terms,
          Nrql: {
            Query: condition.nrql.query,
            SinceValue: condition.nrql.sinceValue
          }
        }
      }
    });
  }
}
