//import schemas from './schemas';
import { Application } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const {NODE_ENV, PORT, baseUrl} = process.env;

export default ({ app }: { app: Application }) => {
  const swaggerDefinition = {
    openapi: '3.0.3',
    info: {
      version: '1.0.0',
      contact: {
        name: 'Ajiboye Adedotun G.',
        email: 'ajiboyeadedotun16@gmai.com',
        url: 'https://github.com/youngprinnce'
      },
      title: 'top100Movies- API',
      description: 'MyTop100Movies - API, Database, CRUD - Application which lets users set their top 100 movies.',
    },
    servers: [
      NODE_ENV === 'development' ? {
        url: `http://localhost:${PORT}`,
        description: 'MyTop100Movies localhost/Development Server'
      } : {
        url: baseUrl,
        description: 'MyTop100Movies Server'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid, or the user does not have access to perform the action',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: "Unauthorized access"
                  }
                }
              }
            }
          },
        },
        NotFoundError: {
          description: 'Not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: "Not found"
                  }
                }
              }
            }
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Auth routes'
      },
      {
        name: 'TOPMOVIES',
        description: 'top100Movies routes'
      },
    ],
  };

  const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "top100Movies - API Documentation v1",
    explorer: true,
    swaggerOptions: {
      urls: [
        {
          url: '/v1/docs',
          name: 'v1'
        },
      ]
    }
  };
  const swaggerDoc = swaggerJSDoc({swaggerDefinition, apis: ['./src/api/v1/components/**/*.yml']});

  app.use('/v1/docs', swaggerUi.serveFiles(swaggerDoc), swaggerUi.setup(swaggerDoc, options));
};
