import http from './http'
export const listAll = (params) => http.get('/payments', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/payments', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/payments/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/payments/'+id).then(r=>r.data)
