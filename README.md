# Newrelic CDK Constructs

This library provides [CDK Constructs](https://aws.amazon.com/cdk/) for Newrelic [Resource Providers](https://docs.newrelic.com/docs/integrations/amazon-integrations/aws-integrations-list/aws-cloudformation-integration).

## Quickstart

Follow the instructions on installing the newrelic resource providers [here](https://docs.newrelic.com/docs/integrations/amazon-integrations/aws-integrations-list/aws-cloudformation-integration).

```bash
$ yarn add newrelic-cdk
```

And add an alert to a cdk stack

```typescript
import * as cdk from '@aws-cdk/core';
import * as newrelic from 'newrelic-cdk';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'my-stack');
const alert = new newrelic.NrqlAlert(stack, 'Alert', {
    apiKey: cdk.SecretValue.plainText('TestingNonsenseKey'),
    policyId: 1,
    enabled: true,
    name: 'TestNRQLCondition',
    runbookUrl: 'www.example.com/runbook',
    expectedGroups: 1,
    ignoreOverlap: true,
    valueFunction: 'string',
    query: 'SELECT count(*) from AwsLambdaInvocationError',
    sinceValue: '3'
});
alert.addTerms({
    duration: '1',
    termOperator: 'above',
    priority: 'low',
    threshold: '20',
    timeFunction: 'all'
});
```
