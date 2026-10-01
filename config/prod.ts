import { EnvironmentConfig } from './dev';

const config: EnvironmentConfig = {
    envName : 'prod',
    awsAccount: '154810815388',
    awsRegion: 'ca-central-1',

    ec2: {
        amiId: 'ami-0bf6dbeae330f5823',
        instanceType: 't3.micro',
        keyName: 'mocanada-kp',
        securityGroupIds: ['sg-01fe8dbe1f0459a15'],
        subnetId: 'subnet-010010e9800ba7607',
    },
    s3: {
    bucketName: 'mmetroc-cdk-app2-oct',
    retainOnDelete: true,
},
    tags: {
        Environment: 'prod',
        Project: 'Metroc'
    }
}
export default config;