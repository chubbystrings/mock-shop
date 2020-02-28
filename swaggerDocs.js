/* eslint-disable no-dupe-keys */

module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.3.0',
    title: 'MOCKSHOP API',
    description: 'Online store API',
    contact: {
      name: 'chubbystrings',
      email: 'info@emekaokwor.com',
      url: 'http://www.emekaokwor.com/',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
    {
      url: 'https://mockshop-product.herokuapp.com',
      description: 'Production server',
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'CRUD operations',
    },
  ],
  paths: {
    '/api/v1/auth/signup': {
      post: {
        tags: ['CRUD operations'],
        description: 'Sign Up Users',
        summary: 'Users can sign Up and create an account, No authentication needed',
        operationId: 'signUp',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Signup',
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          400: {
            description: 'invalid enteries on request body, password is less than 7 characters',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Bad Request invalid enteries',
                },
              },
            },
          },
          409: {
            description: 'Email already exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Duplicate email, email already exist',
                },
              },
            },
          },
          500: {
            description: 'Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Internal server error occurred',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/signin': {
      post: {
        tags: ['CRUD operations'],
        description: 'Log in registered Users',
        summary: 'Registered Users can sign in, response contains JW token for user authentication in header (Bearer)',
        operationId: 'signIn',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Signin',
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          400: {
            description: 'Wrong email or password',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Wrong email or password',
                },
              },
            },
          },
          500: {
            description: 'Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Internal server error occurred',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/products': {
      get: {
        tags: ['CRUD operations'],
        description: 'Users/Admin can view all Products',
        summary: 'Users and Admin can view all products, No authentication is required',
        operationId: 'signIn',
        parameters: [],
        requestBody: {},
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          404: {
            description: 'No products found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Bad Request',
                },
              },
            },
          },
          500: {
            description: 'Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Internal server error occurred',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/products/product/add': {
      security: {
        bearerAuth: [],
      },
      post: {
        tags: ['CRUD operations'],
        description: 'Admin can Add Products',
        summary: 'Only an Admin can Create and add products, requires authentication via JWT file size should not exceed 1mb jpg and png ONLY',
        operationId: 'addProduct',
        parameters: [],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'A Legend',
                  },
                  description: {
                    type: 'string',
                    example: 'A book by Emeka',
                  },
                  category: {
                    type: 'string',
                    example: 'books',
                  },
                  price: {
                    type: 'integer',
                    example: 3000,
                  },
                  inStock: {
                    type: 'boolean',
                    example: true,
                  },

                  image: {
                    type: 'string',
                    format: 'base64',
                  },
                },
              },
              encoding: {
                image: {
                  contentType: 'image/png, image/jpeg, image/jpg',
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'successful',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                          example: 1,
                        },
                        imageUrl: {
                          type: 'string',
                          example: 'https://example.com/image.jpg',
                        },
                      },
                    },
                  },

                },
              },
            },
          },
          400: {
            description: 'Invalid fields provided',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Bad request',
                },
              },
            },
          },
          401: {
            description: 'Not Authorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Unauthorized User',
                },
              },
            },
          },
          405: {
            description: 'Http method not allowed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Method not allowed',
                },
              },
            },
          },

          500: {
            description: 'Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Internal server error occurred',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/products/product/{productid}': {
      security: {
        bearerAuth: [],
      },
      put: {
        tags: ['CRUD operations'],
        description: 'Admin can Edit a Product',
        summary: 'Only an Admin can Edit a specific product, authentication required via JWT, file size should not exceed 1mb jpg and png ONLY',
        operationId: 'EditProduct',
        parameters: [{
          name: 'productid',
          in: 'path',
          required: true,
          description: 'product ID, to fetch product for editing',
          schema: {
            type: 'integer',
            format: 'int64',
            minimum: 1,
          },
        },
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'A Legend is born',
                  },
                  description: {
                    type: 'string',
                    example: 'A book by martins',
                  },
                  category: {
                    type: 'string',
                    example: 'books',
                  },
                  price: {
                    type: 'integer',
                    example: 3000,
                  },
                  inStock: {
                    type: 'boolean',
                    example: true,
                  },

                  image: {
                    type: 'string',
                    format: 'base64',
                  },
                },
              },
              encoding: {
                image: {
                  contentType: 'image/png, image/jpeg, image/jpg',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'successful',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                          example: 1,
                        },
                        imageUrl: {
                          type: 'string',
                          example: 'https://example.com/image.jpg',
                        },
                      },
                    },
                  },

                },
              },
            },
          },
          400: {
            description: 'No product id not provided or Missing fields',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Bad Request',
                },
              },
            },
          },
          401: {
            description: 'Not Authorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Unauthorized User',
                },
              },
            },
          },
          500: {
            description: 'Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Internal server error occurred',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['CRUD operations'],
        description: 'Admin can delete a specific Product',
        summary: 'Admin can delete product, authentication required via JWT',
        operationId: 'DeleteProduct',
        parameters: [{
          name: 'productid',
          in: 'path',
          required: true,
          description: 'product ID, to fetch product for deleting',
          schema: {
            type: 'integer',
            format: 'int64',
            minimum: 1,
          },
        }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'successful',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        message: {
                          type: 'string',
                          example: 'successfully deleted',
                        },
                      },
                    },
                  },

                },
              },
            },
          },
          400: {
            description: 'product id not provided',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Bad request',
                },
              },
            },
          },
          401: {
            description: 'Not Authorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Unauthorized User',
                },
              },
            },
          },
          500: {
            description: 'Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Internal server error occurred',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/cart': {
      security: {
        bearerAuth: [],
      },
      get: {
        tags: ['CRUD operations'],
        description: 'Users can view all Products in  their cart',
        summary: 'Users can view orders on cart, authentication required via JWT',
        operationId: 'cart',
        parameters: [],
        requestBody: {},
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Cart',
                },
              },
            },
          },
          404: {
            description: 'No products found in cart',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Not found',
                },
              },
            },
          },

          500: {
            description: 'Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Internal server error occurred',
                },
              },
            },
          },

        },
      },
    },
    '/api/v1/cart/{productid}': {
      security: {
        bearerAuth: [],
      },
      post: {
        tags: ['CRUD operations'],
        description: 'users can add product/item to cart',
        summary: 'Users can add items/products to cart, authentication required via JWT',
        operationId: 'AddToCart',
        parameters: [{
          name: 'productid',
          in: 'path',
          required: true,
          description: 'product ID, to fetch product to add to cart',
          schema: {
            type: 'integer',
            format: 'int64',
            minimum: 1,
          },
        }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'successful',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                          example: 2,
                        },
                      },
                    },
                  },

                },
              },
            },
          },
          400: {
            description: 'product id not provided',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Bad Request',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized User',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Not Authorized',
                },
              },
            },
          },

          404: {
            description: 'Product not found or not available',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Product not available or not found',
                },
              },
            },
          },
          500: {
            description: 'Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Internal server error occurred',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/cart/{cartid}': {
      security: {
        bearerAuth: [],
      },
      delete: {
        tags: ['CRUD operations'],
        description: 'User can delete Item from cart',
        summary: 'Users can delete/remove items on cart, authentication required via JWT',
        operationId: 'DeleteItemFromCart',
        parameters: [{
          name: 'cartid',
          in: 'path',
          required: true,
          description: 'cart ID, to fetch item in cart for deleting',
          schema: {
            type: 'integer',
            format: 'int64',
            minimum: 1,
          },
        }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'successful',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        message: {
                          type: 'string',
                          example: 'successfully deleted',
                        },
                      },
                    },
                  },

                },
              },
            },
          },
          400: {
            description: 'cart id not provided',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Bad request',
                },
              },
            },
          },

          401: {
            description: 'Unauthorized User',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Not authorized',
                },
              },
            },
          },
          500: {
            description: 'Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  status: 'error',
                  error: 'Internal server error occurred',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'successful',
          },
          data: {
            type: 'object',
            properties: {
              token: {
                type: 'string',

              },
              userId: {
                type: 'integer',
                example: 12,
              },
              email: {
                type: 'string',
                example: 'example@example.com',
              },
              isAdmin: {
                type: 'boolean',
                example: 'FALSE',
              },
            },
          },
        },
      },
      Signup: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            example: 'John',
          },
          lastName: {
            type: 'string',
            example: 'Doe',
          },
          email: {
            type: 'string',
            example: 'example@example.com',
          },
          password: {
            type: 'string',
            example: '1234567',
          },
        },
      },
      Signin: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'example@example.com',
          },
          password: {
            type: 'string',
            example: '1234567',
          },
        },
      },
      Product: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'successful',
          },
          data: {
            type: 'object',
            properties: {
              rows: {
                type: 'array',
                example: [
                  {
                    id: 1,
                    name: 'A legend',
                    description: 'A book by Emeka',
                    price: 5000,
                    category: 'books',
                    inStock: true,
                  },
                ],
              },
            },
          },
        },
      },
      Cart: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'successful',
          },
          data: {
            type: 'object',
            properties: {
              rows: {
                type: 'array',
                example: [
                  {
                    id: 1,
                    cartid: 4,
                    name: 'A legend',
                    description: 'A book by Emeka',
                    price: 5000,
                    category: 'books',
                    inStock: true,
                  },
                ],
              },
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
          },
          error: {
            type: 'string',
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },

  },
};
