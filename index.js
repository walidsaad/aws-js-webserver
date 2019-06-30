const aws = require("@pulumi/aws");

let size = "t2.micro";     // t2.micro is available in the AWS free tier
let ami  = "ami-0bbc25e23a7640b9b"; // AMI for Amazon Linux in us-east-1 (Virginia)

let group = new aws.ec2.SecurityGroup("webserver-secgrp", { 
    ingress: [
        { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
        { protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"] }, 
        // ^-- ADD THIS LINE
    ],
});

let userData = // <-- ADD THIS DEFINITION
`#!/bin/bash
echo "Hello, World!" > index.html
nohup python -m SimpleHTTPServer 80 &`;

let server = new aws.ec2.Instance("web-server-www", {
    instanceType: size,
    securityGroups: [ group.name ], // reference the group object above
    ami: ami,
    userData: userData,             // <-- ADD THIS LINE
});

exports.publicIp = server.publicIp;
exports.publicHostName = server.publicDns;

/*let pulumi = require("@pulumi/pulumi");
let config = new pulumi.Config();
let regionname = config.require("aws:region");
let stackname = pulumi.getStack();
console.log(`Region Name is, ${regionname}!`);
console.log(`Current Stack is, ${stackname}!`);*/
