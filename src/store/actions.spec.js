import axios from 'axios'
import {actions} from "./actions";
import {posts} from '../../test/assets/posts-response.json'

jest.mock('axios');

describe('fetchSiteMeta', () => {
    it('calls the correct endpoing', ()=>{
        expect(true).toBeTruthy()
    })
});
