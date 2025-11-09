import http from './http'
export const listAll = (params) => http.get('/attendance/gym', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/attendance/gym', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/attendance/gym/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/attendance/gym/'+id).then(r=>r.data)
