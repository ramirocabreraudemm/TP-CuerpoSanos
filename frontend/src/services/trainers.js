import http from './http'
export const listAll = (params) => http.get('/trainers', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/trainers', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/trainers/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/trainers/'+id).then(r=>r.data)
