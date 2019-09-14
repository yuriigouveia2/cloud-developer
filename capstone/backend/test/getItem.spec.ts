import { assert, expect } from "chai";
import 'mocha';
import { NoteAccess } from '../src/dataLayer/noteAccess';

describe('GetItem function', function() {
    it('should be an object', async function() {
        const groupAccess = new NoteAccess();
        let result = await groupAccess.GetItem('a2335f3b-9e15-4f36-9543-21051a3574e5', 'google-oauth2|110468438967211736371');
        assert.isObject(result, 'The result is an object')
    })
})

describe('GetAllItems function', function() {
    it('should be a list', async function() {
        const groupAccess = new NoteAccess();
        let result = await groupAccess.GetAllNotes('google-oauth2|110468438967211736371');
        assert.isArray(result, 'The result is a list')
    })
})

describe('NoteExists function', function() {
    it('should be true', async function() {
        const groupAccess = new NoteAccess();
        let result = await groupAccess.noteExists('a2335f3b-9e15-4f36-9543-21051a3574e5','google-oauth2|110468438967211736371');
        expect(result).to.equal(true)
    })
})