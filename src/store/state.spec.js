import {state} from './state.js'

describe('state.js', () => {
    it('has all fields needed on init', () => {
        expect(Object.keys(state).length).toEqual(10)
        expect(Object.keys(state)).toContain('post')
        expect(Object.keys(state)).toContain('categories')
        expect(Object.keys(state)).toContain('page')
        expect(Object.keys(state)).toContain('site')
        expect(Object.keys(state)).toContain('found')
        expect(Object.keys(state)).toContain('traverse')
        expect(Object.keys(state)).toContain('traverseIds')
        expect(Object.keys(state)).toContain('lastUpdated')
        expect(Object.keys(state)).toContain('jetpack-testimonial')
    })
})