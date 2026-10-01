#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { MetrocCdkApp2Stack } from '../lib/metroc-cdk-app2-stack';

import devConfig from '../config/dev';
import uatConfig from '../config/uat';
import prodConfig from '../config/prod';

const app = new cdk.App();

const environment = app.node.tryGetContext('environment') || 'dev';
const configs = {
  dev: devConfig,
  uat: uatConfig,
  prod: prodConfig,
}

const config = configs[environment as keyof typeof configs];

new MetrocCdkApp2Stack(
  app,
  `MetrocCdkApp2Stack-${config.envName}`,
  config,
  {
    env: {
      account: config.awsAccount,
      region: config.awsRegion,
    },
  },
);