import http from './http'
export const listAll = (params) => http.get('/classes', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/classes', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/classes/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/classes/'+id).then(r=>r.data)
