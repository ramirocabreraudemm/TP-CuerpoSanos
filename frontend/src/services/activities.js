import http from './http'
export const listAll = (params) => http.get('/activities', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/activities', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/activities/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/activities/'+id).then(r=>r.data)
