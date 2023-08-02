import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
      title: 'Code Companion API',
      description: 'REST API endpoints of Code Companion application',
    },
    host: 'localhost:3000',
    schemes: ['http','https'],
};

const outputFile = './swagger_output.json';
const endpointFiles = ['./src/server.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointFiles, doc);