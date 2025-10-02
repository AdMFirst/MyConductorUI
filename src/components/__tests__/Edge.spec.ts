import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Edge from '../Edge.vue'

describe('Edge', () => {
  it('opens menu and emits node selection', async () => {
    const wrapper = mount(Edge, {
      props: { position: 1 },
    })

    expect(wrapper.find('div.neobrutalism').exists()).toBe(false)

    await wrapper.find('button').trigger('click')
    expect(wrapper.findAll('button').length).toBeGreaterThan(1)

    await wrapper.find('button.neobrutalism-button.neobrutalism-quinary').trigger('click')

    const events = wrapper.emitted('add-node')
    expect(events).toBeTruthy()
    expect(events?.[0][0]).toEqual({ position: 1, type: 'http' })
    expect(wrapper.find('button').text()).toBe('Add Step')
  })

  it('closes menu via cancel', async () => {
    const wrapper = mount(Edge, {
      props: { position: 3 },
    })

    await wrapper.find('button').trigger('click')

    const cancel = wrapper
      .findAll('button')
      .find((btn) => btn.text() === 'Cancel')

    await cancel?.trigger('click')
    expect(wrapper.find('button').text()).toBe('Add Step')
  })
})
