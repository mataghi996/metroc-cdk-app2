export interface EnvironmentConfig {
    envName : string;
    awsAccount: string;
    awsRegion: string;

    ec2: {
        amiId: string;
        instanceType: string;
        keyName: string;
        securityGroupIds: string[];
        subnetId: string;
    }
    s3: {
        bucketName: string;        // must be globally unique
        retainOnDelete: boolean;   // true = RETAIN, false = DESTROY
    }
    tags: {
        [key: string]: string;
    }    
}

const config: EnvironmentConfig = {
    envName : 'dev',
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
        bucketName: 'metroc-cdk-app2-oct',
        retainOnDelete: false,   // dev can be torn down cleanly
    },
    tags: {
        Environment: 'dev',
        Project: 'Metroc'
    }
}
export default config;