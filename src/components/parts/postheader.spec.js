import {shallowMount} from '@vue/test-utils'

import PostHeader from './PostHeader.vue'

describe('PostHeader.vue', () => {
    it('is a vue component', () => {
        const wrapper = shallowMount(PostHeader, {
            props: {
                title: '', url: 'https://localhost:3000', featuredImage: ''
            },
            global: {
                stubs: {
                    RouterLink: true
                }
            }
        });
        expect(wrapper.vm).toBeTruthy()
    })

    it('is a vue component', () => {
        const wrapper = shallowMount(PostHeader, {
            props: {
                title: '', url: 'https://localhost:3000', featuredImage: ''
            },
            global: {
                stubs: {
                    RouterLink: true
                }
            }
        });
        expect(wrapper.vm).toBeTruthy()
    })
});
