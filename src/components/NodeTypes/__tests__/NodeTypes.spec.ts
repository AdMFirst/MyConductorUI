import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import HttpNode from '../HttpNode.vue'
import InlineNode from '../InlineNode.vue'
import SimpleNode from '../SimpleNode.vue'
import StaticNode from '../StaticNode.vue'

describe('NodeTypes', () => {
  it('HttpNode syncs props and emits changes', async () => {
    const wrapper = mount(HttpNode, {
      props: {
        value: {
          name: 'HTTP Step',
          reference: 'ref1',
          url: 'https://initial',
          method: 'GET',
          body: '{"foo":1}',
        },
      },
    })

    const inputs = wrapper.findAll('input')
    expect((inputs[0].element as HTMLInputElement).value).toBe('HTTP Step')

    await inputs[1].setValue('nextRef')
    await flushPromises()

    const events = wrapper.emitted('change')
    expect(events?.at(-1)?.[0]).toMatchObject({ reference: 'nextRef' })

    await wrapper.find('select').setValue('POST')
    await flushPromises()

    expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ method: 'POST' })

    await wrapper.setProps({
      value: {
        name: 'Updated',
        reference: 'updatedRef',
        url: 'https://updated',
        method: 'DELETE',
        body: '{"bar":2}',
      },
    })
    await flushPromises()

    const refreshedInputs = wrapper.findAll('input')
    expect((refreshedInputs[0].element as HTMLInputElement).value).toBe('Updated')

    await wrapper.find('button.neobrutalism-secondary').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
  })

  it('InlineNode mirrors values and raises change events', async () => {
    const wrapper = mount(InlineNode, {
      props: {
        value: { name: 'Inline', reference: 'inlineRef', code: 'return 1' },
      },
    })

    const [nameInput, refInput] = wrapper.findAll('input')
    expect((nameInput.element as HTMLInputElement).value).toBe('Inline')

    await refInput.setValue('updatedRef')
    await flushPromises()

    const events = wrapper.emitted('change')
    expect(events?.at(-1)?.[0]).toMatchObject({ reference: 'updatedRef' })

    await wrapper.find('textarea').setValue('return 2')
    await flushPromises()

    expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ code: 'return 2' })

    await wrapper.setProps({ value: { name: 'External', reference: 'ext', code: 'return 3' } })
    await flushPromises()

    const refreshedInlineInputs = wrapper.findAll('input')
    expect((refreshedInlineInputs[0].element as HTMLInputElement).value).toBe('External')

    await wrapper.find('button.neobrutalism-secondary').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
  })

  it('SimpleNode syncs and emits', async () => {
    const wrapper = mount(SimpleNode, {
      props: {
        value: { name: 'Simple', reference: 'simpleRef' },
      },
    })

    const [nameInput, refInput] = wrapper.findAll('input')

    await nameInput.setValue('Renamed')
    await flushPromises()

    expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ name: 'Renamed' })

    await wrapper.setProps({ value: { name: 'External', reference: 'externalRef' } })
    await flushPromises()

    const refreshedSimpleInputs = wrapper.findAll('input')
    expect((refreshedSimpleInputs[1].element as HTMLInputElement).value).toBe('externalRef')

    await wrapper.find('button.neobrutalism-secondary').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
  })

  it('StaticNode toggles label based on type', () => {
    const start = mount(StaticNode, { props: { type: 'start' } })
    expect(start.text()).toContain('Start')
    expect(start.attributes()['data-node-type']).toBe('start')

    const end = mount(StaticNode, { props: { type: 'end' } })
    expect(end.text()).toContain('Stop')
    expect(end.attributes()['data-node-type']).toBe('end')
  })
})
