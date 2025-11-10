import http from './http'
export const listAll = (params) => http.get('/miembros', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/miembros', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/miembros/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/miembros/'+id).then(r=>r.data)
