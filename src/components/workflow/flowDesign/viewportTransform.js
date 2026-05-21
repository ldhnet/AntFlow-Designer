import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

const DEFAULT_OPTIONS = {
  minScale: 0.4,
  maxScale: 2.5,
  zoomInFactor: 1.1,
  zoomOutFactor: 0.9
}

const wheelListenerOptions = { passive: false }

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export function useViewportTransform(viewportRef, options = {}) {
  const config = {
    ...DEFAULT_OPTIONS,
    ...options
  }

  const isDragging = ref(false)

  const viewportState = reactive({
    x: 0,
    y: 0,
    scale: 1
  })

  const dragState = reactive({
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0
  })

  const flowTransformStyle = computed(() => {
    const x = Math.round(viewportState.x)
    const y = Math.round(viewportState.y)

    return {
      transform: `translate3d(${x}px, ${y}px, 0) scale(${viewportState.scale})`,
      transformOrigin: '0 0'
    }
  })

  const zoomPercent = computed(() => `${Math.round(viewportState.scale * 100)}%`)
  const canZoomIn = computed(() => viewportState.scale < config.maxScale)
  const canZoomOut = computed(() => viewportState.scale > config.minScale)

  const getViewportCenter = () => {
    if (!viewportRef.value) {
      return { x: 0, y: 0 }
    }
    const rect = viewportRef.value.getBoundingClientRect()
    return {
      x: rect.width / 2,
      y: rect.height / 2
    }
  }

  const applyScale = (newScale, anchorX, anchorY) => {
    const oldScale = viewportState.scale
    const nextScale = clamp(newScale, config.minScale, config.maxScale)
    if (nextScale === oldScale) {
      return
    }

    const worldX = (anchorX - viewportState.x) / oldScale
    const worldY = (anchorY - viewportState.y) / oldScale

    viewportState.scale = nextScale
    viewportState.x = anchorX - worldX * nextScale
    viewportState.y = anchorY - worldY * nextScale
  }

  const zoomIn = () => {
    const center = getViewportCenter()
    applyScale(viewportState.scale * config.zoomInFactor, center.x, center.y)
  }

  const zoomOut = () => {
    const center = getViewportCenter()
    applyScale(viewportState.scale * config.zoomOutFactor, center.x, center.y)
  }

  const resetView = () => {
    viewportState.x = 0
    viewportState.y = 0
    viewportState.scale = 1
  }

  const onMouseDown = (event) => {
    if (event.button !== 0) {
      return
    }
    isDragging.value = true
    dragState.startX = event.clientX
    dragState.startY = event.clientY
    dragState.originX = viewportState.x
    dragState.originY = viewportState.y
  }

  const onMouseMove = (event) => {
    if (!isDragging.value) {
      return
    }
    viewportState.x = dragState.originX + (event.clientX - dragState.startX)
    viewportState.y = dragState.originY + (event.clientY - dragState.startY)
  }

  const onMouseUp = () => {
    isDragging.value = false
  }

  const onWheel = (event) => {
    if (!viewportRef.value) {
      return
    }

    if (event.cancelable) {
      event.preventDefault()
    }

    const rect = viewportRef.value.getBoundingClientRect()
    const pointerX = event.clientX - rect.left
    const pointerY = event.clientY - rect.top
    const zoomFactor = event.deltaY < 0 ? config.zoomInFactor : config.zoomOutFactor
    applyScale(viewportState.scale * zoomFactor, pointerX, pointerY)
  }

  onMounted(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    viewportRef.value?.addEventListener('wheel', onWheel, wheelListenerOptions)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    viewportRef.value?.removeEventListener('wheel', onWheel, wheelListenerOptions)
  })

  const viewportViewState = {
    isDragging,
    flowTransformStyle,
    zoomPercent,
    canZoomIn,
    canZoomOut
  }

  return {
    viewportViewState,
    onMouseDown,
    zoomIn,
    zoomOut,
    resetView
  }
}
