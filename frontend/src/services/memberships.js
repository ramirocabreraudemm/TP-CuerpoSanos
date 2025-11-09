import http from './http'
export const listAll = (params) => http.get('/memberships', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/memberships', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/memberships/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/memberships/'+id).then(r=>r.data)
