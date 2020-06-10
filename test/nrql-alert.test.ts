import { expect, exactlyMatchTemplate } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';

it('nrql-alert', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'my-stack');
  expect(stack).to(exactlyMatchTemplate({
    Resources: {
    
    }
  }));
});