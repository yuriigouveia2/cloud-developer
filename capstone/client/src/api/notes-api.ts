import { apiEndpoint } from '../config'
import { Note } from '../types/Note';
import { CreateNoteRequest } from '../types/CreateNoteRequest';
import Axios from 'axios'
import { UpdateNoteRequest } from '../types/UpdateNoteRequest';

export async function getNotes(idToken: string): Promise<Note[]> {
  console.log('Fetching notes')

  const response = await Axios.get(`${apiEndpoint}/notes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Notes:', response.data)
  return response.data.items
}

export async function createNote(
  idToken: string,
  newNote: CreateNoteRequest
): Promise<Note> {
  const reply = await fetch(`${apiEndpoint}/notes`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(newNote)
  })
  const result = await reply.json()
  return result.newItem
}

export async function patchNote(
  idToken: string,
  noteId: string,
  updatedNote: UpdateNoteRequest
): Promise<void> {

  await fetch(`${apiEndpoint}/notes/${noteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(updatedNote)
  })
}

export async function deleteNote(
  idToken: string,
  noteId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/notes/${noteId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  noteId: string
): Promise<string> {
  const reply =  await fetch(`${apiEndpoint}/notes/${noteId}/attachment`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${idToken}`
    },
    body: ''    
  })

  const result = await reply.json()
  return result.uploadUrl;
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
