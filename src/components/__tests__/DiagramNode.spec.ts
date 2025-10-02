import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DiagramNode from '../DiagramNode.vue'

describe('DiagramNode', () => {
  it('applies accent classes and renders slots', () => {
    const wrapper = mount(DiagramNode, {
      props: {
        title: 'Demo Node',
        subtitle: 'Subtext',
        accent: 'primary',
      },
      slots: {
        default: '<p id=\"body\">Content</p>',
        footer: '<span id=\"footer\">Footer</span>',
      },
    })

    const header = wrapper.find('header')
    expect(header.classes()).toContain('neobrutalism-primary')
    expect(wrapper.find('#body').text()).toBe('Content')
    expect(wrapper.find('#footer').text()).toBe('Footer')
  })

  it('falls back to neutral styling when no accent provided', () => {
    const wrapper = mount(DiagramNode, {
      props: { title: 'Plain Node' },
      slots: { default: '<div>Inner</div>' },
    })

    expect(wrapper.find('header').classes()).not.toContain('neobrutalism-primary')
    expect(wrapper.find('header').classes()).not.toContain('neobrutalism-secondary')
  })
})
