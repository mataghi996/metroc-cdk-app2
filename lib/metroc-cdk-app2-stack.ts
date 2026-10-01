import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
 
import { EnvironmentConfig } from '../config/dev';
 
export class MetrocCdkApp2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, config: EnvironmentConfig, props?: cdk.StackProps) {
    super(scope, id, props);
 
    // ---------------------------------------------------------------
    // KMS key used to encrypt the S3 bucket
    // ---------------------------------------------------------------
    const encryptionKey = new kms.Key(this, 'MetroC-S3-KmsKey', {
      alias: 'alias/metroc-s3-key',
      description: 'KMS key for MetroC S3 bucket encryption',
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
 
    // ---------------------------------------------------------------
    // S3 bucket: versioning enabled + KMS encryption
    // ---------------------------------------------------------------
    const bucket = new s3.Bucket(this, 'MetroC-S3-Bucket', {
      versioned: true,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: encryptionKey,
      bucketKeyEnabled: true, // reduces KMS request costs
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
 
    // ---------------------------------------------------------------
    // IAM role assumed by EC2 + AWS managed policies
    // ---------------------------------------------------------------
    const ec2Role = new iam.Role(this, 'MetroC-EC2-Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      description: 'Role assumed by the MetroC EC2 instance',
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2FullAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
      ],
    });
 
    // Allow the role to use the KMS key (needed to read/write encrypted objects)
    encryptionKey.grantEncryptDecrypt(ec2Role);
 
    // Instance profile: this is what actually attaches the role to an EC2 instance
    const instanceProfile = new iam.CfnInstanceProfile(this, 'MetroC-EC2-InstanceProfile', {
      roles: [ec2Role.roleName],
    });
 
    // ---------------------------------------------------------------
    // EC2 instance (now with the instance profile attached)
    // ---------------------------------------------------------------
    const cfnInstance = new ec2.CfnInstance(this, 'MetroC-EC2-Instance', {
      imageId: config.ec2.amiId,
      instanceType: config.ec2.instanceType,
      keyName: config.ec2.keyName,
      securityGroupIds: config.ec2.securityGroupIds,
      subnetId: config.ec2.subnetId,
      iamInstanceProfile: instanceProfile.ref,
      tags: Object.entries(config.tags).map(([key, value]) => ({
        key,
        value,
      })),
      //userData: 'userData',
    });
 
    // Optional: handy outputs
    new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new cdk.CfnOutput(this, 'KmsKeyArn', { value: encryptionKey.keyArn });
    new cdk.CfnOutput(this, 'Ec2RoleArn', { value: ec2Role.roleArn });
 
    // Create an RDS instance
  }
}
 
