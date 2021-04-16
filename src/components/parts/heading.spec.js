import {mount} from '@vue/test-utils'
import {createStore} from 'vuex'

import Heading from './Heading.vue'
import PrimaryNavigation from './PrimaryNavigation.vue'
import Branding from './Branding.vue'

const store = createStore({
    state() {
    },
    mutations: {},
    getters: {
        getSiteConfig: () => jest.fn()
    }
})

const mockRoute = {
    params: {
        id: 1
    }
}
const mockRouter = {
    push: jest.fn(),
    currentRoute: {
        value: {
            path: '/'
        }
    }
}

describe('Heading.vue', () => {
    it('is a vue component', () => {
        const wrapper = mount(Heading, {
            global: {
                plugins: [store],
                mocks: {
                    $route: mockRoute,
                    $router: mockRouter
                },
                stubs: {
                    RouterLink: true
                }
            }
        });
        expect(wrapper.vm).toBeTruthy()
    })

    it('Heading has a header component', () => {
        const wrapper = mount(Heading, {
            global: {
                plugins: [store],
                mocks: {
                    $route: mockRoute,
                    $router: mockRouter
                },
                stubs: {
                    RouterLink: true
                }
            }
        });
        expect(wrapper.findAll('header').length).toBe(1)
        expect(wrapper.find('header').classes()).toContain('site-header')
    });

    it('Heading has nav', () => {
        const wrapper = mount(Heading, {
            global: {
                plugins: [store],
                mocks: {
                    $route: mockRoute,
                    $router: mockRouter
                },
                stubs: {
                    RouterLink: true
                }
            }
        });
        expect(wrapper.findComponent(PrimaryNavigation)).toBeTruthy()
        expect(wrapper.findComponent(Branding)).toBeTruthy()
    });
});
