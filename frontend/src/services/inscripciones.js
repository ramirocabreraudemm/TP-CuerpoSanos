import http from './http'

export const listAll = (params) => 
  http.get('/inscripciones', { params }).then(r => r.data)

export const createOne = (payload) => 
  http.post('/inscripciones', payload).then(r => r.data)

export const deleteOne = (id) => 
  http.delete('/inscripciones/' + id).then(r => r.data)

// auxiliares para traer miembros y clases (ya existen en el sistema)
export const listMiembros = () => 
  http.get('/miembros').then(r => r.data)

export const listClases = () => 
  http.get('/clases').then(r => r.data)
