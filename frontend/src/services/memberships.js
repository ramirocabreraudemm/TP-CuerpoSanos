import http from './http'
export const listAll = (params) => http.get('/TipoMembresias', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/TipoMembresias', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/TipoMembresias/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/TipoMembresias/'+id).then(r=>r.data)
