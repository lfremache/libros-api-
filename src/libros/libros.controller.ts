import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Res,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { LibrosService } from './libros.service';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  // GET /libros  ·  GET /libros?autor=Rulfo
  @Get()
  listar(@Query('autor') autor?: string) {
    return this.librosService.listar(autor);
  }

  // GET /libros/:id
  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.obtener(id);
  }

  // POST /libros  →  201 + cabecera Location
  @Post()
  crear(
    @Body() cuerpo,
    @Res({ passthrough: true }) res: Response,
  ) {
    const nuevo = this.librosService.crear(cuerpo);
    res.setHeader('Location', `/libros/${nuevo.id}`);
    res.status(201);
    return nuevo;
  }

  // PUT /libros/:id  →  reemplaza el libro completo
  @Put(':id')
  reemplazar(
    @Param('id', ParseIntPipe) id: number,
    @Body() cuerpo,
  ) {
    return this.librosService.reemplazar(id, cuerpo);
  }

  // PATCH /libros/:id  →  modifica solo los campos enviados
  @Patch(':id')
  modificar(
    @Param('id', ParseIntPipe) id: number,
    @Body() cambios,
  ) {
    return this.librosService.modificar(id, cambios);
  }

  // DELETE /libros/:id  →  204 sin cuerpo
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(@Param('id', ParseIntPipe) id: number) {
    this.librosService.eliminar(id);
  }
}
