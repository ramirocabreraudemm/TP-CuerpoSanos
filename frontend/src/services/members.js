import http from './http'
export const listAll = (params) => http.get('/members', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/members', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/members/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/members/'+id).then(r=>r.data)
