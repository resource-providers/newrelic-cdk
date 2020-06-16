import { expect, exactlyMatchTemplate } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';

import { NrqlAlert } from '../lib';

// https://github.com/newrelic/cloudformation-partner-integration/blob/master/NrqlAlertCondition/src/test/resources/nrql-alert-test.json

test('nrql-alert', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'my-stack');
  new NrqlAlert(stack, 'Alert', {
    apiKey: cdk.SecretValue.plainText('TestingNonsenseKey'),
    policyId: 1,
    enabled: true,
    name: 'TestNRQLCondition',
    id: 1,
    runbookUrl: 'www.example.com/runbook',
    expectedGroups: 1,
    ignoreOverlap: true,
    valueFunction: 'string',
    query: 'SELECT count(*) from AwsLambdaInvocationError',
    sinceValue: '3'
  });
  expect(stack).to(exactlyMatchTemplate({
    Resources: {
      Alert: {
        "ApiKey": "TestingNonsenseKey",
        "PolicyId": 1,
        "NrqlCondition": {
          "Name": "TestNRQLCondition",
          "RunbookUrl": "www.example.com/runbook",
          "Enabled": true,
          "ValueFunction": "string",
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
  }));
});