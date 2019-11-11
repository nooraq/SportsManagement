import { demo } from './adapter';

export const postLogin = async data => await demo.post('./login', data);
export const getRecords = async params =>
  await demo.get('./plogs', {
    params
  });
export const getSchedules = async params =>
  await demo.get('./competitions', {
    params
  });
export const getPlayers = async params =>
  await demo.get('./players', {
    params
  });
export const getAdmins = async params =>
  await demo.get('./admins', {
    params
  });
export const getProjects = async params =>
  await demo.get('./projects', {
    params
  });
export const postSchedule = async data =>
  await demo.post('./competitions', data);
export const postRecord = async data => await demo.post('./plogs', data);
export const postAdmin = async data => await demo.post('./admins', data);
export const postPlayer = async data => await demo.post('./players', data);
export const postProject = async data => await demo.post('./projects', data);
export const putSchedule = async (id, data) =>
  await demo.put(`./competitions/${id}`, data);
export const putRecord = async (id, data) =>
  await demo.put(`./plogs/${id}`, data);
export const putAdmin = async (id, data) =>
  await demo.put(`./admins/${id}`, data);
export const putPlayer = async (id, data) =>
  await demo.put(`./players/${id}`, data);
export const putProject = async (id, data) =>
  await demo.put(`./projects/${id}`, data);

export const deleteSchedule = async (id, data) =>
  await demo.delete(`./competitions/${id}`, data);
export const deleteRecord = async (id, data) =>
  await demo.delete(`./plogs/${id}`, data);
export const deleteAdmin = async id => await demo.delete(`./admins/${id}`);
export const deletePlayer = async id => await demo.delete(`./players/${id}`);
export const deleteProject = async id => await demo.delete(`./projects/${id}`);
