import * as cdk from '@aws-cdk/core';

export interface Operator {
  ABOVE='above',
  BELOW='below',
  EQUAL='equal'
}

export enum Priority {
  LOW='low',
  CRITICAL='critical',
  WARNING='warning'
}

export interface TimeFunction {
  /**
   * corresponding to at least once in in the UI
   */
  ANY='any',

  /**
   * corresponding to for at least in the UI
   */
  ALL='all'
}

export enum ValueFunction {
  /**
   * condition is evaluated based on each query's returned value
   */
  SINGLE_VALUE='single_value',
  /**
   * condition is evaluated based on the sum of each query's returned values over the specified duration
   */
  SUM='sum'
}

export interface Term {
  /**
   * This is the time (in minutes) for the condition to persist before triggering an event. It corresponds to the duration set when adding a threshold to an alert in the UI.
   */
  readonly duration: string;
  
  /**
   * This determines what comparison will be used between the value_function and the terms[threshold] value to trigger an event. It corresponds to the operation selected when adding a threshold to an alert in the UI
   */
  readonly termOperator: Operator;
  
  /**
   * This corresponds to the severity level selected when setting the threshold values for the condition in the UI
   */
  readonly priority: Priority;
  
  /**
   * This is the threshold that the value_function must be compared to using the terms[operator] for an event to be triggered. It corresponds to the numeric value specified in the UI when adding the threshold values.
This is a numeric value and must be 0 (zero) or greater.
   */
  readonly threshold: number;
  
  /**
   * This corresponds to the settings made in the UI when adding the threshold values.
   */
  readonly timeFunction: TimeFunction;
}

export interface NrqlAlertProps {
  readonly apiKey: cdk.SecretValue;
  readonly policyId: number;
  
  /**
   * an array of condition terms
   * @default no terms
   */
  readonly terms?: Term[];
  
  /**
   * status of your alert condition
   * @default false
   */
  readonly enabled?: boolean;
  
  /**
   * This is a title for your condition and will allow to you identify it in the New Relics Alerts UI.
   */
  readonly name: string;
  
  /**
   * This defines the type of metric that will be used for the alert. Allowable content for the metric field depends on the type value chosen
   */
  readonly type?: string;
  
  /**
   * The runbook URL to display in notifications
   * @default no runbookUrl
   */
  readonly runbookUrl?: string;
  
  /**
   * the number of groups you expect to see at any given time. It is used in combination with the ignoreOverlap option
   */
  readonly expectedGroups: number;
  
  /**
   * If disabled, New Relic looks for a convergence of groups. If the condition is looking for 2 or more groups, and the returned values cannot be separated into that number of distinct groups, then that will also produce a violation. This type of overlap event is represented on a chart by group bands touching.
   */
  readonly ignoreOverlap: boolean;
  
  /**
   * the value function used from the plugin metric
   */
  readonly valueFunction: ValueFunction;
  
  /**
   * This is the NRQL query that New Relic Alerts monitors as part of a NRQL condition.
   */
  readonly query: string;
  
  /**
   * This is the timeframe (in minutes) in which to evaluate the specified NRQL query. since_value must be between 1 and 20.
   */
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
          Type: props.type,
          RunbookUrl: props.runbookUrl,
          Enabled: props.enabled || false,
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
      Threshold: term.threshold.toString(),
      TimeFunction: term.timeFunction
    }
  }
}
