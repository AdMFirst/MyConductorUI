import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

vi.mock('axios', () => ({
  default: {
    put: vi.fn(),
    get: vi.fn(),
  },
}))

import axios from 'axios'
import App from '../App.vue'

const mockedAxios = axios as unknown as {
  put: ReturnType<typeof vi.fn>
  get: ReturnType<typeof vi.fn>
}

const randomUUID = vi.fn().mockReturnValue('fixed-uuid')

const setCryptoMock = () => {
  Object.defineProperty(globalThis, 'crypto', {
    value: { randomUUID },
    configurable: true,
  })
}

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    randomUUID.mockReset()
    randomUUID.mockReturnValue('fixed-uuid')
    setCryptoMock()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const makeWrapper = () => mount(App)

  it('creates nodes with default payloads', () => {
    const wrapper = makeWrapper()

    expect(wrapper.vm.makeNode('simple')).toEqual({
      type: 'simple',
      data: { name: '', reference: '' },
    })
    expect(wrapper.vm.makeNode('inline')).toEqual({
      type: 'inline',
      data: { name: '', reference: '', code: '' },
    })
    expect(wrapper.vm.makeNode('http')).toEqual({
      type: 'http',
      data: {
        name: '',
        reference: '',
        url: '',
        method: 'GET',
        body: '',
      },
    })
    expect(wrapper.vm.makeNode('unknown')).toEqual({ type: 'unknown', data: {} })
  })

  it('parses body values safely', () => {
    const wrapper = makeWrapper()

    expect(wrapper.vm.parseBodyValue('')).toBeUndefined()
    expect(wrapper.vm.parseBodyValue('  ')).toBeUndefined()
    expect(wrapper.vm.parseBodyValue('{"foo":"bar"}')).toEqual({ foo: 'bar' })
    expect(wrapper.vm.parseBodyValue('plain-text')).toBe('plain-text')
  })

  it('builds tasks for supported node types', () => {
    const wrapper = makeWrapper()

    const httpTask = wrapper.vm.buildTask(
      {
        type: 'http',
        data: {
          name: 'Fetch',
          reference: 'getCustomers',
          url: ' https://example.com ',
          method: 'post',
          body: '{"active":true}',
        },
      },
      0,
    )

    expect(httpTask).toMatchObject({
      type: 'HTTP',
      taskReferenceName: 'getCustomers',
      inputParameters: {
        http_request: {
          uri: 'https://example.com',
          method: 'POST',
          body: { active: true },
        },
      },
    })

    const inlineTask = wrapper.vm.buildTask(
      {
        type: 'inline',
        data: { name: '', reference: '', code: '' },
      },
      1,
    )
    expect(inlineTask).toMatchObject({
      type: 'INLINE',
      scriptExpression: '',
      name: 'Step 2',
      taskReferenceName: 'task2',
    })

    const inlineDefault = wrapper.vm.buildTask(
      {
        type: 'inline',
        data: { name: '', reference: '' } as any,
      },
      2,
    )
    expect(inlineDefault?.scriptExpression).toBe("return 'hello world!'")

    const simpleTask = wrapper.vm.buildTask(
      {
        type: 'simple',
        data: { name: '', reference: '' },
      },
      3,
    )
    expect(simpleTask).toMatchObject({
      type: 'SIMPLE',
      name: 'Step 4',
      taskReferenceName: 'task4',
    })
  })

  it('buildWorkflow composes workflow metadata and filters invalid tasks', () => {
    const wrapper = makeWrapper()
    wrapper.vm.workflowName = 'myconductorui-generated-fixed-uuid'
    wrapper.vm.nodes = [
      {
        type: 'http',
        data: {
          name: 'Fetch Data',
          reference: 'fetchData',
          url: 'https://example',
          method: 'GET',
          body: '',
        },
      },
      {
        type: 'unknown',
        data: {},
      },
    ]

    const workflow = wrapper.vm.buildWorkflow()
    expect(workflow.name).toBe('myconductorui-generated-fixed-uuid')
    expect(workflow.tasks).toHaveLength(1)
    expect(workflow.tasks[0]).toMatchObject({ type: 'HTTP' })
  })

  it('handleAddNode inserts nodes at constrained positions', async () => {
    const wrapper = makeWrapper()
    mockedAxios.put.mockResolvedValue({ status: 200, data: {} })
    mockedAxios.get.mockResolvedValue({ status: 200, data: {} })

    wrapper.vm.nodes = [
      { type: 'simple', data: { name: 'A', reference: 'a' } },
    ]

    wrapper.vm.handleAddNode({ position: -10, type: 'http' })
    await flushPromises()
    expect(wrapper.vm.nodes[0].type).toBe('http')

    wrapper.vm.handleAddNode({ position: 50, type: 'simple' })
    await flushPromises()
    expect(wrapper.vm.nodes).toHaveLength(3)
    expect(wrapper.vm.nodes[2].type).toBe('simple')
  })

  it('handleDeleteNode removes a node and triggers processing', async () => {
    const wrapper = makeWrapper()
    mockedAxios.put.mockResolvedValue({ status: 200, data: {} })
    mockedAxios.get.mockResolvedValue({ status: 200, data: {} })

    wrapper.vm.nodes = [
      { type: 'simple', data: { name: 'A', reference: 'a' } },
      { type: 'inline', data: { name: 'B', reference: 'b', code: '' } },
    ]

    wrapper.vm.handleDeleteNode(0)
    expect(wrapper.vm.nodes).toHaveLength(1)

    await flushPromises()

    expect(mockedAxios.put).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
  })

  it('handleNodeChange deep clones payload and debounces processing', async () => {
    vi.useFakeTimers()
    const wrapper = makeWrapper()
    mockedAxios.put.mockResolvedValue({ status: 200, data: {} })
    mockedAxios.get.mockResolvedValue({ status: 200, data: {} })

    wrapper.vm.nodes = [
      { type: 'inline', data: { name: 'A', reference: 'a', code: '' } },
    ]

    const payload = { name: 'Updated', reference: 'new', code: 'return 1' }
    wrapper.vm.handleNodeChange(0, payload)

    expect(wrapper.vm.nodes[0].data).not.toBe(payload)

    await vi.advanceTimersByTimeAsync(800)
    await flushPromises()

    expect(mockedAxios.put).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
  })

  it('processWorkflow returns early without nodes', async () => {
    const wrapper = makeWrapper()
    await wrapper.vm.processWorkflow()
    expect(mockedAxios.put).not.toHaveBeenCalled()
    expect(wrapper.vm.isProcessing).toBe(false)
  })

  it('processWorkflow uploads and fetches workflow JSON', async () => {
    const wrapper = makeWrapper()
    wrapper.vm.workflowName = 'myconductorui-generated-initial-uuid'

    wrapper.vm.nodes = [
      {
        type: 'http',
        data: {
          name: 'Fetch',
          reference: 'fetch',
          url: 'https://example.com',
          method: 'GET',
          body: '',
        },
      },
    ]

    mockedAxios.put.mockResolvedValue({ status: 200, data: {} })
    mockedAxios.get.mockResolvedValue({ status: 200, data: { ok: true } })

    await wrapper.vm.processWorkflow()
    expect(mockedAxios.put).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('myconductorui-generated-initial-uuid'),
    )
    expect(wrapper.vm.generatedJson).toContain('"ok": true')
    expect(wrapper.vm.isProcessing).toBe(false)
  })

  it('processWorkflow handles upload failure', async () => {
    const wrapper = makeWrapper()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    wrapper.vm.nodes = [
      {
        type: 'simple',
        data: { name: '', reference: '' },
      },
    ]

    mockedAxios.put.mockResolvedValue({ status: 500, data: { message: 'fail' } })

    await wrapper.vm.processWorkflow()

    expect(wrapper.vm.generatedJson).toBe('Something went wrong please try again later...')
    expect(wrapper.vm.isProcessing).toBe(false)
    expect(mockedAxios.get).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('processWorkflow handles fetch failure', async () => {
    const wrapper = makeWrapper()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    wrapper.vm.nodes = [
      {
        type: 'simple',
        data: { name: '', reference: '' },
      },
    ]

    mockedAxios.put.mockResolvedValue({ status: 200, data: {} })
    mockedAxios.get.mockResolvedValue({ status: 500, data: { message: 'fail' } })

    await wrapper.vm.processWorkflow()

    expect(wrapper.vm.generatedJson).toBe('Something went wrong please try again later...')
    expect(wrapper.vm.isProcessing).toBe(false)
    errorSpy.mockRestore()
  })

  it('handleResetWorkflow clears state and generates a new workflow id', async () => {
    randomUUID.mockReturnValueOnce('initial').mockReturnValueOnce('after-reset')
    const wrapper = makeWrapper()
    wrapper.vm.generatedJson = 'content'
    wrapper.vm.nodes = [
      { type: 'inline', data: { name: 'x', reference: 'y', code: 'z' } },
    ]

    await wrapper.vm.handleResetWorkflow()

    expect(wrapper.vm.generatedJson).toBe('')
    expect(wrapper.vm.nodes).toHaveLength(0)
    expect(wrapper.vm.workflowName).toBe('myconductorui-generated-after-reset')
  })
})











