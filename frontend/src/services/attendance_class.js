import http from './http'
export const listAll = (params) => http.get('/asistencias/clases', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/asistencias/clases', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/asistencias/clases/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/asistencias/clases/'+id).then(r=>r.data)