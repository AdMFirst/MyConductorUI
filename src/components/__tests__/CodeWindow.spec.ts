import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeWindow from '../CodeWindow.vue'

describe('CodeWindow', () => {
  it('renders placeholder text based on processing state', async () => {
    const wrapper = mount(CodeWindow, {
      props: { code: '', isProcessing: false },
    })

    expect(wrapper.find('textarea').attributes('placeholder')).toBe(
      'Generated JSON code will appear here...',
    )

    await wrapper.setProps({ isProcessing: true })

    expect(wrapper.find('textarea').attributes('placeholder')).toBe(
      'Generating workflow JSON (mock)...',
    )
  })

  it('copies JSON to clipboard when available', async () => {
    const clipboardSpy = vi.spyOn(navigator.clipboard, 'writeText')
    const alertSpy = vi.spyOn(globalThis, 'alert')
    const value = '{"foo":"bar"}'

    const wrapper = mount(CodeWindow, {
      props: { code: value, isProcessing: false },
    })

    await wrapper.findAll('button')[0].trigger('click')

    expect(clipboardSpy).toHaveBeenCalledWith(value)
    expect(alertSpy).toHaveBeenCalledWith('JSON copied to clipboard!')
  })

  it('emits reset when clear button clicked', async () => {
    const wrapper = mount(CodeWindow, {
      props: { code: '', isProcessing: false },
    })

    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('reset')).toBeTruthy()
  })
})


