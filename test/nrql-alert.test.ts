import { expect, exactlyMatchTemplate } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';

import { NrqlAlert, Operator, Priority, TimeFunction, ValueFunction } from '../lib';

// https://github.com/newrelic/cloudformation-partner-integration/blob/master/NrqlAlertCondition/src/test/resources/nrql-alert-test.json

test('nrql-alert', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'my-stack');
  const alert = new NrqlAlert(stack, 'Alert', {
    apiKey: cdk.SecretValue.plainText('TestingNonsenseKey'),
    policyId: 1,
    enabled: true,
    name: 'TestNRQLCondition',
    runbookUrl: 'www.example.com/runbook',
    expectedGroups: 1,
    ignoreOverlap: true,
    valueFunction: ValueFunction.SUM,
    query: 'SELECT count(*) from AwsLambdaInvocationError',
    sinceValue: '3'
  });
  alert.addTerms({
    duration: '1',
    termOperator: Operator.ABOVE,
    priority: Priority.LOW,
    threshold: 20,
    timeFunction: TimeFunction.ALL
  })
  expect(stack).to(exactlyMatchTemplate({
    Resources: {
      "Alert8B5C7F27": {
        "Type": "NewRelic::Alerts::NrqlAlert",
        "Properties": {
          "ApiKey": "TestingNonsenseKey",
          "PolicyId": 1,
          "NrqlCondition": {
            "Name": "TestNRQLCondition",
            "RunbookUrl": "www.example.com/runbook",
            "Enabled": true,
            "ValueFunction": "sum",
            "ExpectedGroups": 1,
            "IgnoreOverlap": true,
            "Terms": [
              {
                "Duration": "1",
                "Operator": "above",
                "Priority": "low",
                "Threshold": "20",
                "TimeFunction": "all"
              }
            ],
            "Nrql": {
              "Query": "SELECT count(*) from AwsLambdaInvocationError",
              "SinceValue": "3"
            }
          }
        }
      }
    }
  }));
});