export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'API Punto de Venta - Ferretería',
    description: 'Sistema completo de gestión para punto de venta con control de inventario, ventas, devoluciones y corte de caja.',
    version: '1.0.0',
    contact: {
      name: 'Soporte Técnico',
      email: 'soporte@ferreteria-pdv.com'
    },
    license: {
      name: 'MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo'
    },
    {
      url: 'https://api.ferreteria-pdv.com',
      description: 'Servidor de producción'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Token obtenido del endpoint de login'
      }
    },
    schemas: {
      Usuario: {
        type: 'object',
        properties: {
          id_usuario: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Juan Pérez' },
          email: { type: 'string', example: 'juan@ferreteria.com' },
          rol: { type: 'string', enum: ['cajero', 'administrador', 'supervisor', 'encargado_inventario'], example: 'cajero' },
          estado: { type: 'string', enum: ['activo', 'inactivo'], example: 'activo' }
        }
      },
      Categoria: {
        type: 'object',
        properties: {
          id_categoria: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Herramientas' },
          descripcion: { type: 'string', example: 'Herramientas manuales y eléctricas' },
          creado_en: { type: 'string', format: 'date-time' }
        }
      },
      Producto: {
        type: 'object',
        properties: {
          id_producto: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Martillo de acero' },
          sku: { type: 'string', example: 'SKU001' },
          id_categoria: { type: 'integer', example: 1 },
          descripcion: { type: 'string', example: 'Martillo de acero forjado' },
          precio_costo: { type: 'number', format: 'decimal', example: 50.00 },
          precio_venta: { type: 'number', format: 'decimal', example: 99.99 },
          stock_actual: { type: 'integer', example: 45 },
          stock_minimo: { type: 'integer', example: 10 },
          estado: { type: 'string', enum: ['activo', 'inactivo'], example: 'activo' },
          creado_en: { type: 'string', format: 'date-time' }
        }
      },
      Turno: {
        type: 'object',
        properties: {
          id_turno: { type: 'integer', example: 1 },
          id_cajero: { type: 'integer', example: 1 },
          monto_inicial: { type: 'number', format: 'decimal', example: 500.00 },
          hora_apertura: { type: 'string', format: 'date-time' },
          hora_cierre: { type: 'string', format: 'date-time', nullable: true },
          estado: { type: 'string', enum: ['abierto', 'cerrado'], example: 'abierto' }
        }
      },
      Venta: {
        type: 'object',
        properties: {
          id_venta: { type: 'integer', example: 1 },
          id_turno: { type: 'integer', example: 1 },
          id_cajero: { type: 'integer', example: 1 },
          folio: { type: 'string', example: 'FOLIO001' },
          metodo_pago: { type: 'string', enum: ['efectivo', 'tarjeta', 'transferencia'], example: 'efectivo' },
          subtotal: { type: 'number', format: 'decimal', example: 250.00 },
          impuesto: { type: 'number', format: 'decimal', example: 40.00 },
          descuento_total: { type: 'number', format: 'decimal', example: 0 },
          total: { type: 'number', format: 'decimal', example: 290.00 },
          monto_pagado: { type: 'number', format: 'decimal', example: 300.00 },
          cambio: { type: 'number', format: 'decimal', example: 10.00 },
          estado: { type: 'string', enum: ['completada', 'cancelada'], example: 'completada' },
          creado_en: { type: 'string', format: 'date-time' }
        }
      },
      DetalleVenta: {
        type: 'object',
        properties: {
          id_detalle: { type: 'integer', example: 1 },
          id_venta: { type: 'integer', example: 1 },
          id_producto: { type: 'integer', example: 1 },
          cantidad: { type: 'integer', example: 2 },
          precio_unitario: { type: 'number', format: 'decimal', example: 100.00 },
          subtotal_linea: { type: 'number', format: 'decimal', example: 200.00 },
          impuesto_linea: { type: 'number', format: 'decimal', example: 32.00 },
          total_linea: { type: 'number', format: 'decimal', example: 232.00 }
        }
      },
      CorteCaja: {
        type: 'object',
        properties: {
          id_corte: { type: 'integer', example: 1 },
          id_turno: { type: 'integer', example: 1 },
          id_supervisor: { type: 'integer', example: 2 },
          efectivo_esperado: { type: 'number', format: 'decimal', example: 5000.00 },
          efectivo_contado: { type: 'number', format: 'decimal', example: 5050.00 },
          diferencia: { type: 'number', format: 'decimal', example: 50.00 },
          total_tarjeta: { type: 'number', format: 'decimal', example: 1500.00 },
          total_ventas: { type: 'number', format: 'decimal', example: 6550.00 },
          num_transacciones: { type: 'integer', example: 25 },
          justificacion: { type: 'string', example: 'Sobrante por redondeos' },
          creado_en: { type: 'string', format: 'date-time' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Mensaje de error detallado' },
          statusCode: { type: 'integer', example: 400 }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          usuario: { $ref: '#/components/schemas/Usuario' }
        }
      }
    },
    responses: {
      Unauthorized: {
        description: 'No autorizado - Token inválido o expirado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      Forbidden: {
        description: 'Prohibido - Rol insuficiente',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      NotFound: {
        description: 'No encontrado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      BadRequest: {
        description: 'Solicitud inválida',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verificar estado de la API',
        description: 'Endpoint para verificar que la API está funcionando correctamente',
        responses: {
          '200': {
            description: 'API funcionando',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Autenticación'],
        summary: 'Iniciar sesión',
        description: 'Autentica un usuario y retorna un JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'juan@ferreteria.com' },
                  password: { type: 'string', format: 'password', example: 'password123' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Inicio de sesión exitoso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          '401': {
            description: 'Credenciales inválidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Autenticación'],
        summary: 'Obtener información del usuario actual',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Información del usuario actual',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Usuario' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/api/v1/categorias': {
      get: {
        tags: ['Categorías'],
        summary: 'Listar todas las categorías',
        parameters: [
          {
            name: 'estado',
            in: 'query',
            description: 'Filtrar por estado (activo/inactivo)',
            schema: { type: 'string', enum: ['activo', 'inactivo'] }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de categorías',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Categoria' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Categorías'],
        summary: 'Crear nueva categoría',
        security: [{ BearerAuth: [] }],
        description: 'Solo administradores pueden crear categorías',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nombre'],
                properties: {
                  nombre: { type: 'string', example: 'Electricidad' },
                  descripcion: { type: 'string', example: 'Productos eléctricos y cables' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Categoría creada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Categoria' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' }
        }
      }
    },
    '/api/v1/categorias/{id}': {
      patch: {
        tags: ['Categorías'],
        summary: 'Actualizar categoría',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: { type: 'string', example: 'Electricidad Mejorada' },
                  descripcion: { type: 'string', example: 'Productos eléctricos, cables y accesorios' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Categoría actualizada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Categoria' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/v1/productos': {
      get: {
        tags: ['Productos'],
        summary: 'Listar todos los productos',
        parameters: [
          {
            name: 'id_categoria',
            in: 'query',
            description: 'Filtrar por categoría',
            schema: { type: 'integer' }
          },
          {
            name: 'estado',
            in: 'query',
            description: 'Filtrar por estado',
            schema: { type: 'string', enum: ['activo', 'inactivo'] }
          },
          {
            name: 'buscar',
            in: 'query',
            description: 'Buscar por nombre o SKU',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de productos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Producto' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Productos'],
        summary: 'Crear nuevo producto',
        security: [{ BearerAuth: [] }],
        description: 'Solo administradores pueden crear productos',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nombre', 'sku', 'id_categoria', 'precio_venta', 'precio_costo'],
                properties: {
                  nombre: { type: 'string', example: 'Martillo de acero' },
                  sku: { type: 'string', example: 'SKU001' },
                  id_categoria: { type: 'integer', example: 1 },
                  precio_costo: { type: 'number', example: 50.00 },
                  precio_venta: { type: 'number', example: 99.99 },
                  descripcion: { type: 'string', example: 'Martillo de acero forjado de alta resistencia' },
                  stock_minimo: { type: 'integer', example: 10 }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Producto creado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Producto' }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' }
        }
      }
    },
    '/api/v1/productos/{id}': {
      get: {
        tags: ['Productos'],
        summary: 'Obtener producto por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Datos del producto',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Producto' }
                  }
                }
              }
            }
          },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/v1/productos/{id}/precio': {
      patch: {
        tags: ['Productos'],
        summary: 'Actualizar precio de producto',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['precio_venta'],
                properties: {
                  precio_venta: { type: 'number', example: 109.99 }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Precio actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Producto' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/v1/productos/{id}/desactivar': {
      patch: {
        tags: ['Productos'],
        summary: 'Desactivar producto',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Producto desactivado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Producto' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/v1/productos/totales': {
      post: {
        tags: ['Productos'],
        summary: 'Calcular totales de productos',
        description: 'Calcula el valor total del inventario y otros totales',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id_categoria: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Totales calculados',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        total_productos: { type: 'integer', example: 45 },
                        valor_total_costo: { type: 'number', example: 2250.00 },
                        valor_total_venta: { type: 'number', example: 4499.55 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/turnos': {
      post: {
        tags: ['Turnos'],
        summary: 'Abrir nuevo turno',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['monto_inicial'],
                properties: {
                  monto_inicial: { type: 'number', example: 500.00 }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Turno abierto exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Turno' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/api/v1/turnos/activo': {
      get: {
        tags: ['Turnos'],
        summary: 'Obtener turno activo del usuario',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Turno activo del usuario',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Turno' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': {
            description: 'No hay turno activo',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/api/v1/ventas': {
      post: {
        tags: ['Ventas'],
        summary: 'Registrar nueva venta',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['lineas'],
                properties: {
                  lineas: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id_producto', 'cantidad', 'precio_unitario'],
                      properties: {
                        id_producto: { type: 'integer', example: 1 },
                        cantidad: { type: 'integer', example: 2 },
                        precio_unitario: { type: 'number', example: 100.00 }
                      }
                    }
                  },
                  metodo_pago: { type: 'string', enum: ['efectivo', 'tarjeta', 'transferencia'], example: 'efectivo' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Venta registrada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        sale: { $ref: '#/components/schemas/Venta' },
                        folio: { type: 'string', example: 'FOLIO001' },
                        total: { type: 'number', example: 290.00 }
                      }
                    }
                  }
                }
              }
            }
          },
          '409': {
            description: 'Producto sin existencia o turno no abierto',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/api/v1/ventas/{id}/descuento': {
      post: {
        tags: ['Ventas'],
        summary: 'Aplicar descuento a una venta',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['valor'],
                properties: {
                  valor: { type: 'number', example: 10, description: 'Porcentaje de descuento (0-100)' },
                  id_autorizo: { type: 'integer', example: 2, description: 'ID del supervisor que autoriza descuento mayor al límite' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Descuento aplicado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        sale: { $ref: '#/components/schemas/Venta' },
                        descuento: { type: 'number', example: 29.00 }
                      }
                    }
                  }
                }
              }
            }
          },
          '403': {
            description: 'Descuento fuera del límite sin autorización',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/v1/ventas/{id}/ticket': {
      get: {
        tags: ['Ventas'],
        summary: 'Obtener ticket de venta',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Ticket de venta',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        venta: { $ref: '#/components/schemas/Venta' },
                        detalles: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/DetalleVenta' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/v1/cortes': {
      post: {
        tags: ['Corte de Caja'],
        summary: 'Crear corte de caja',
        security: [{ BearerAuth: [] }],
        description: 'Solo supervisores y administradores pueden crear cortes de caja',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['efectivo_contado', 'efectivo_esperado'],
                properties: {
                  id_turno: { type: 'integer', example: 1, description: 'Si no se proporciona, se usa el turno activo' },
                  id_supervisor: { type: 'integer', example: 2 },
                  efectivo_contado: { type: 'number', example: 5050.00, description: 'Efectivo contado en caja' },
                  efectivo_esperado: { type: 'number', example: 5000.00, description: 'Efectivo esperado al inicio del turno' },
                  total_tarjeta: { type: 'number', example: 1500.00 },
                  total_ventas: { type: 'number', example: 6550.00 },
                  num_transacciones: { type: 'integer', example: 25 },
                  justificacion: { type: 'string', example: 'Sobrante por redondeos' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Corte de caja creado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/CorteCaja' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Datos inválidos o turno no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' }
        }
      },
      get: {
        tags: ['Corte de Caja'],
        summary: 'Obtener historial de cortes de caja',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Historial de cortes de caja',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/CorteCaja' }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' }
        }
      }
    },
    '/api/v1/inventario/entradas': {
      post: {
        tags: ['Inventario'],
        summary: 'Registrar entrada de mercancía',
        security: [{ BearerAuth: [] }],
        description: 'Registra la entrada de productos al inventario (compras, reposiciones)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id_producto', 'cantidad', 'precio_unitario'],
                properties: {
                  id_producto: { type: 'integer', example: 1 },
                  cantidad: { type: 'integer', example: 50 },
                  precio_unitario: { type: 'number', example: 45.00 },
                  referencia: { type: 'string', example: 'FACTURA001', description: 'Número de factura o referencia de compra' },
                  motivo: { type: 'string', example: 'Compra a proveedor' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Entrada de mercancía registrada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        id_movimiento: { type: 'integer' },
                        stock_nuevo: { type: 'integer', example: 95 }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' }
        }
      }
    },
    '/api/v1/inventario/ajustes': {
      post: {
        tags: ['Inventario'],
        summary: 'Registrar ajuste de inventario',
        security: [{ BearerAuth: [] }],
        description: 'Registra ajustes de inventario (pérdidas, daños, devoluciones de cliente)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id_producto', 'cantidad_ajuste', 'motivo'],
                properties: {
                  id_producto: { type: 'integer', example: 1 },
                  cantidad_ajuste: { type: 'integer', example: -5, description: 'Cantidad a ajustar (positivo o negativo)' },
                  motivo: { type: 'string', example: 'Producto dañado en almacén' },
                  referencia: { type: 'string', example: 'REF001' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Ajuste registrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        id_ajuste: { type: 'integer' },
                        stock_nuevo: { type: 'integer', example: 40 }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' }
        }
      }
    },
    '/api/v1/inventario/stock-bajo': {
      get: {
        tags: ['Inventario'],
        summary: 'Obtener productos con stock bajo',
        security: [{ BearerAuth: [] }],
        description: 'Retorna lista de productos cuyo stock está por debajo del mínimo configurado',
        responses: {
          '200': {
            description: 'Productos con stock bajo',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Producto' }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' }
        }
      }
    }
  },
  security: [{ BearerAuth: [] }]
};
