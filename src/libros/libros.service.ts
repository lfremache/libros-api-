import { Injectable, NotFoundException } from '@nestjs/common';

export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  disponible: boolean;
}

@Injectable()
export class LibrosService {
  private libros: Libro[] = [
    { id: 1, titulo: 'Cien años de soledad', autor: 'García Márquez', disponible: true },
    { id: 2, titulo: 'El túnel',             autor: 'Sabato',          disponible: true },
    { id: 3, titulo: 'Rayuela',              autor: 'Cortázar',        disponible: false },
  ];

  private siguienteId = 4;

  // ── Helper: encuentra el índice o lanza 404 ──────────────────────────────
  private indiceDe(id: number): number {
    const idx = this.libros.findIndex((l) => l.id === id);
    if (idx === -1) throw new NotFoundException(`No existe el libro ${id}`);
    return idx;
  }

  // ── GET /libros  (filtro opcional por autor) ──────────────────────────────
  listar(autor?: string): Libro[] {
    if (autor) {
      return this.libros.filter((l) =>
        l.autor.toLowerCase().includes(autor.toLowerCase()),
      );
    }
    return this.libros;
  }

  // ── GET /libros/:id ───────────────────────────────────────────────────────
  obtener(id: number): Libro {
    return this.libros[this.indiceDe(id)];
  }

  // ── POST /libros ──────────────────────────────────────────────────────────
  crear(datos: Omit<Libro, 'id'>): Libro {
    const nuevo: Libro = { id: this.siguienteId++, ...datos };
    this.libros.push(nuevo);
    return nuevo;
  }

  // ── PUT /libros/:id ───────────────────────────────────────────────────────
  reemplazar(id: number, datos: Omit<Libro, 'id'>): Libro {
    const idx = this.indiceDe(id);
    this.libros[idx] = { id, ...datos };
    return this.libros[idx];
  }

  // ── PATCH /libros/:id ─────────────────────────────────────────────────────
  modificar(id: number, cambios: Partial<Omit<Libro, 'id'>>): Libro {
    const idx = this.indiceDe(id);
    this.libros[idx] = { ...this.libros[idx], ...cambios };
    return this.libros[idx];
  }

  // ── DELETE /libros/:id ────────────────────────────────────────────────────
  eliminar(id: number): void {
    const idx = this.indiceDe(id);
    this.libros.splice(idx, 1);
  }
}
