import React, { useState, useRef, useEffect, createElement } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ZoomIn, ZoomOut, MousePointer, Users, Hand, Trash2 } from 'lucide-react'
import { ELEMENTS_WITH_CHILDREN, findElementInTreeWithPath, type CanvasElement } from '../pages/sheet-page'
import { useSelector } from 'react-redux'
import { type RootState } from '@/redux/store'
import { socket } from '@/config/socket'
import { useParams } from 'react-router-dom'
import { useGetResource } from '@/hooks/useApiResource'

interface CanvasProps {
  canvasElements: any[]
  selectedElement: string | null
  onSelectElement: (id: string | null) => void
  onDropComponent: (component: any, position: { x: number, y: number }, parentId: string) => void
  onMoveElement: (elementId: string, newPosition: { x: number, y: number }) => void
  onResizeElement: (elementId: string, newSize: { width: number, height: number }) => void
  onElementDragStart: (elementId: string) => void
  onElementDragEnd: () => void
  onElementDelete: (elementId: string) => void
  // collaborators?: Array<{ id: string, name: string, color: string, position?: { x: number, y: number } }>
}
// let collaborators: any[] = []
export function Canvas({
  canvasElements,
  selectedElement,
  onSelectElement,
  onDropComponent,
  onMoveElement,
  onResizeElement,
  onElementDragStart,
  onElementDragEnd,
  onElementDelete
  // collaborators = []
}: CanvasProps) {
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [activeTool, setActiveTool] = useState<'select' | 'pan'>('select')
  const [resizing, setResizing] = useState<{ elementId: string, handle: string } | null>(null)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  // const { createResource: updateCursor } = useCreateResource({ endpoint: '/api/workspace/update-cursor' })
  const user = useSelector((state: RootState) => state.user)
  const { sheetId } = useParams()
  const { resource: sheet, isLoading } = useGetResource<any>({ endpoint: `/api/workspace/sheet/${sheetId}` })
  const [collaborators, setCollaborators] = useState<any>([])
  // const { collaborators } = useSelector((state: RootState) => state.workspace)
  // console.log(isLoading, sheet?.colaboration_session?.session_participants?.length)
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const newZoom = zoom - e.deltaY * 0.001
      setZoom(Math.min(Math.max(0.25, newZoom), 3))
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'pan') {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  let subs = false
  useEffect(() => {
    if (!subs) {
      if (sheet?.colaboration_session?.session_participants.length > 0) {
        setCollaborators(sheet?.colaboration_session?.session_participants)
      }
    }
    return () => {
      subs = true
    }
  }, [!isLoading])

  let subscribe = true
  useEffect(() => {
    // void mutate()
    if (subscribe) {
      if (sheet?.colaboration_session?.session_participants.length > 0) {
        setCollaborators(sheet?.colaboration_session?.session_participants)
      }
    }
    return () => {
      subscribe = false
    }
  }, [sheet?.colaboration_session?.session_participants])

  useEffect(() => {
    sheet && socket.on(`cursor/${sheet.id}`, (data: any) => {
      const newCollaborators = collaborators.filter((col: any) => col.is_active).map((col: any) => {
        if (col.user.id === data.user.id) {
          return {
            ...col,
            cursor_x: data.cursor_x,
            cursor_y: data.cursor_y
          }
        }
        return col
      })
      setCollaborators(newCollaborators)
    })
    return () => {
      sheet && socket.off(`cursor/${sheet.id}`)
    }
  }, [socket, collaborators.length > 0, sheet])

  useEffect(() => {
    sheet && socket.on(`sheet/${sheet.id}`, (data: any) => {
      setCollaborators(data.colaboration_session?.session_participants)
    })
    sheet && socket.on(`cursor/${sheet.id}`, (data: any) => {
      const newCollaborators = collaborators.filter((col: any) => col.is_active).map((col: any) => {
        if (col.user.id === data.user.id) {
          return {
            ...col,
            cursor_x: data.cursor_x,
            cursor_y: data.cursor_y
          }
        }
        return col
      })
      setCollaborators(newCollaborators)
    })
    return () => {
      sheet && socket.off(`sheet/${sheet.id}`)
      sheet && socket.off(`cursor/${sheet.id}`)
    }
  }, [socket, sheet])

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return
    const x = (e.clientX - canvasRect.left - offset.x) / zoom
    const y = (e.clientY - canvasRect.top - offset.y) / zoom

    const sessionUser = sheet?.colaboration_session?.session_participants.find((col: any) => col.user.id === user.id)
    socket.emit('updateCursor', {
      ...sessionUser,
      cursor_x: x,
      cursor_y: y,
      sheetId
    })

    if (isDragging && activeTool === 'pan') {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      setOffset({ x: offset.x + dx, y: offset.y + dy })
      setDragStart({ x: e.clientX, y: e.clientY })
      return
    }

    if (resizing && canvasRef.current) {
      e.preventDefault()

      const dx = (e.clientX - resizeStart.x) / zoom
      const dy = (e.clientY - resizeStart.y) / zoom

      const element = canvasElements.find(el => el.id === resizing.elementId)
      if (!element?.style.width || !element.style.height) return
      let newWidth = resizeStart.width
      let newHeight = resizeStart.height
      const newPosition: { x: number, y: number } = { ...element.position }
      switch (resizing.handle) {
        case 'e':
          newWidth = Math.max(20, resizeStart.width + dx)
          break
        case 'se':
          newWidth = Math.max(20, resizeStart.width + dx)
          newHeight = Math.max(20, resizeStart.height + dy)
          break
        case 's':
          newHeight = Math.max(20, resizeStart.height + dy)
          break
        case 'sw':
          newWidth = Math.max(20, resizeStart.width - dx)
          newHeight = Math.max(20, resizeStart.height + dy)
          newPosition.x = e.clientX - canvasRef.current.getBoundingClientRect().left - offset.x
          break
        case 'w':
          newWidth = Math.max(20, resizeStart.width - dx)
          newPosition.x = e.clientX - canvasRef.current.getBoundingClientRect().left - offset.x
          break
        case 'nw':
          newWidth = Math.max(20, resizeStart.width - dx)
          newHeight = Math.max(20, resizeStart.height - dy)
          newPosition.x = e.clientX - canvasRef.current.getBoundingClientRect().left - offset.x
          newPosition.y = e.clientY - canvasRef.current.getBoundingClientRect().top - offset.y
          break
        case 'n':
          newHeight = Math.max(20, resizeStart.height - dy)
          newPosition.y = e.clientY - canvasRef.current.getBoundingClientRect().top - offset.y
          break
        case 'ne':
          newWidth = Math.max(20, resizeStart.width + dx)
          newHeight = Math.max(20, resizeStart.height - dy)
          newPosition.y = e.clientY - canvasRef.current.getBoundingClientRect().top - offset.y
          break
      }

      if (newPosition.x !== element.position.x || newPosition.y !== element.position.y) {
        onMoveElement(resizing.elementId, newPosition)
      }

      onResizeElement(resizing.elementId, { width: newWidth, height: newHeight })
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false)
    }

    if (resizing) {
      setResizing(null)
      if (selectedElement) {
        e.stopPropagation()
      }
    }
  }
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const component = e.dataTransfer.getData('componentId')
    if (!component) return
    let compoenentParse = JSON.parse(component)
    const parentElementId = e.target as HTMLDivElement
    let elementId
    if (compoenentParse.sendRoot) {
      const removeSendRoot = JSON.parse(component)
      const { sendRoot, lastId, parentId, ...rest } = removeSendRoot
      compoenentParse = rest
      elementId = lastId
      if (lastId === parentElementId.id) {
        // onElementDelete(lastId as string)
      } else {
        onElementDelete(lastId as string)
      }
      if (parentElementId.id === '') {
        onElementDelete(lastId as string)
      }
    }

    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return

    const x = (e.clientX - canvasRect.left - offset.x) / zoom
    const y = (e.clientY - canvasRect.top - offset.y) / zoom
    if (parentElementId.id === elementId) {
      return
    }

    onDropComponent(compoenentParse, { x, y }, parentElementId.id)
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.25))
  }

  const resetZoom = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation()

    if (activeTool !== 'select') return

    onSelectElement(elementId)

    if (!resizing) {
      const element = canvasElements.find(el => el.id === elementId)
      if (!element) return

      onElementDragStart(elementId)

      const startX = e.clientX
      const startY = e.clientY
      const startElementX = element.position.x
      const startElementY = element.position.y

      const handleElementDrag = (moveEvent: MouseEvent) => {
        if (!canvasRef.current) return

        const dx = (moveEvent.clientX - startX) / zoom
        const dy = (moveEvent.clientY - startY) / zoom

        const newX = startElementX + dx
        const newY = startElementY + dy

        onMoveElement(elementId, { x: newX, y: newY })
      }

      const handleElementDragEnd = () => {
        document.removeEventListener('mousemove', handleElementDrag)
        document.removeEventListener('mouseup', handleElementDragEnd)
        onElementDragEnd()
      }

      document.addEventListener('mousemove', handleElementDrag)
      document.addEventListener('mouseup', handleElementDragEnd)
    }
  }

  const handleResizeStart = (e: React.MouseEvent, elementId: string, handle: string) => {
    e.stopPropagation()
    e.preventDefault()

    onSelectElement(elementId)

    const element = canvasElements.find(el => el.id === elementId)
    if (!element?.style.width || !element.style.height) return

    setResizing({ elementId, handle })
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: element.style.width,
      height: element.style.height
    })

    document.body.style.userSelect = 'none'

    const handleResizeEnd = () => {
      setResizing(null)
      document.body.style.userSelect = ''
      document.removeEventListener('mouseup', handleResizeEnd)
    }

    document.addEventListener('mouseup', handleResizeEnd)
  }

  const handleCanvasClick = () => {
    if (!resizing) {
      onSelectElement(null)
    }
  }

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     switch (e.key.toLowerCase()) {
  //       case 'v':
  //         setActiveTool('select')
  //         break
  //       case 'h':
  //         setActiveTool('pan')
  //         break
  //       case 'delete':
  //       case 'backspace':
  //         if (selectedElement) {
  //           onElementDelete(selectedElement)
  //         }
  //         break
  //       default:
  //         break
  //     }
  //   }

  //   window.addEventListener('keydown', handleKeyDown)
  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown)
  //   }
  // }, [selectedElement, onElementDelete])

  // const generateElement = (type: string, properties: any, children: React.ReactNode[] | React.ReactNode | string) => {
  //   return createElement(type, properties, children)
  // }
  const generateElement = (
    element: CanvasElement,
    selectedElement: string | null,
    onSelectElement: (id: string | null) => void,
    activeTool: string,
    handleElementMouseDown: (e: React.MouseEvent, elementId: string) => void,
    handleResizeStart: (e: React.MouseEvent, elementId: string, handle: string) => void
  ): React.ReactNode => {
    const canAcceptChildren = ELEMENTS_WITH_CHILDREN.includes(element.type)
    const baseProps: any = {
      key: element.id,
      id: element.id,
      className: element.type === 'main'
        ? `absolute component-hover hover:ring-2 hover:ring-sky-300 ${selectedElement === element.id ? 'ring-2 ring-sky-600' : ''}`
        : `${element.position?.x > 0 ? 'absolute' : ''} component-hover hover:ring-2 hover:ring-sky-300 ${selectedElement === element.id ? 'ring-2 ring-sky-600' : ''
        }`,
      style: {
        ...element.style,
        width: element.style?.width
          ? `${element.style.width}${element.style.widthUnit || 'px'}`
          : 'auto',
        height: element.style?.height
          ? `${element.style.height}${element.style.heightUnit || 'px'}`
          : 'auto',
        left: `${element.position.x}px`,
        top: `${element.position.y}px`
        // opacity: element.isBeingDragged ? 0.7 : 1
      },
      ...element.properties,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        if (activeTool === 'select') {
          onSelectElement(element.id)
        }
      },
      onMouseDown: (e: React.MouseEvent) => {
        const ele = e.target as HTMLDivElement
        const foundElement = findElementInTreeWithPath(canvasElements as CanvasElement[], ele.id)?.element ?? element
        if (activeTool === 'select' && foundElement?.type === 'main') {
          handleElementMouseDown(e, element.id)
        }
      },
      draggable: activeTool === 'select' && element.type !== 'main',
      onDragStart: (e: React.DragEvent) => {
        const ele = e.target as HTMLDivElement
        const foundElement = findElementInTreeWithPath(canvasElements as CanvasElement[], ele.id)?.element
        if (foundElement?.type === 'main') return
        e.dataTransfer.setData('componentId', JSON.stringify({
          ...foundElement,
          sendRoot: true,
          lastId: foundElement?.id,
          parentId: ele.id
        }))
        e.dataTransfer.effectAllowed = 'move'
        onElementDragStart(element.id)
      },
      onDragEnd: () => {
        onElementDragEnd()
      }
    }

    if (canAcceptChildren) {
      baseProps.onDragOver = (e: React.DragEvent) => { // esto es cuando se arrastra un elemento sobre otro
        e.preventDefault()
        e.currentTarget.classList.add('drop-target')
        e.dataTransfer.dropEffect = 'move'
      }

      baseProps.onDragLeave = (e: React.DragEvent) => { // esto es cuando se sale el elemento arrastrado de otro
        e.currentTarget.classList.remove('drop-target')
      }
    }

    let childrenContent: React.ReactNode[] | string | null = null
    if (typeof element.children === 'string') {
      childrenContent = element.children
    } else {
      childrenContent = element.children
        ? element.children?.map((child: CanvasElement) => {
          if (typeof child === 'string') {
            return child
          } else {
            return generateElement(
              child,
              selectedElement,
              onSelectElement,
              activeTool,
              handleElementMouseDown,
              handleResizeStart
            )
          }
        })
        : null
    }

    if (element.type === 'main' && selectedElement === element.id) {
      childrenContent = Array.isArray(childrenContent) ? childrenContent : []

      childrenContent.push(
        ...['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'].map((handle: string) => (
          <div
            key={handle}
            className={`resize-handle resize-handle-${handle}`}
            onMouseDown={(e) => { handleResizeStart(e, element.id, handle) }}
          />
        ))
      )
    }

    if (element.type === 'main') {
      childrenContent = Array.isArray(childrenContent) ? childrenContent : []

      childrenContent.push(<span key={`${element.type}-${crypto.randomUUID()}`} className='absolute -top-8 text-gray-600 whitespace-nowrap select-none'>
        {element.name} - {element.id.slice(element.id.length - 5)}
      </span>)
    }

    return createElement(element.type, baseProps, childrenContent)
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Canvas toolbar */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === 'select' ? 'secondary' : 'outline'}
                size="icon"
                className={`h-9 w-9 shadow-sm backdrop-blur-sm bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 ${activeTool === 'select' ? 'bg-light-bg-primary/75 dark:bg-dark-bg-primary/75 hover:dark:bg-dark-bg-primary/75' : ''}`}
                onClick={() => { setActiveTool('select') }}
              >
                <MousePointer className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Seleccionar (V)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === 'pan' ? 'secondary' : 'outline'}
                size="icon"
                className={`h-9 w-9 shadow-sm backdrop-blur-sm bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 ${activeTool === 'pan' ? 'bg-light-bg-secondary/75 dark:bg-dark-bg-primary/75 hover:dark:bg-dark-bg-primary/75' : ''}`}
                onClick={() => { setActiveTool('pan') }}
              >
                <Hand className={`${activeTool === 'pan' ? 'text-white' : 'text-light-text-secondary dark:text-dark-text-secondary'} h-4 w-4`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Pan (H)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {selectedElement && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shadow-sm text-red-500"
                  onClick={() => { onElementDelete(selectedElement) }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Eliminar (Delete)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 bg-light-bg-primary dark:bg-dark-bg-primary shadow-sm"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="h-9 px-2 bg-light-bg-primary dark:bg-dark-bg-primary shadow-sm"
          onClick={resetZoom}
        >
          {Math.round(zoom * 100)}%
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 bg-light-bg-primary dark:bg-dark-bg-primary shadow-sm"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Collaborators list */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white dark:bg-dark-bg-secondary shadow-sm rounded-full py-1 px-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          {/* <div className="flex -space-x-2">
            {collaborators?.map((collaborator: any) => (
              <Tooltip key={collaborator.id}>
                <TooltipTrigger asChild>
                  <img
                    src={collaborator.user.avatar_url}
                    alt={collaborator.user.name}
                    className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-800
                      ${collaborator.user.id === user.id
                        ? 'ring-2 ring-yellow-500 z-10'
                        : collaborator.is_active ? 'ring-2 ring-sky-400' : 'opacity-50'}
                      `}
                    style={{ cursor: 'pointer' }}
                    title={collaborator.user.name}
                  />
                </TooltipTrigger>
                <TooltipContent side='bottom'>{collaborator.user.name}</TooltipContent>
              </Tooltip>
            ))}
          </div> */}
          <div className="flex -space-x-1">
            {collaborators?.filter((col: any) => col.is_active).map((collaborator: any) => (
              <Tooltip key={collaborator.id}>
                <TooltipTrigger asChild>
                  <img
                    src={collaborator.user.avatar_url}
                    alt={collaborator.user.name}
                    className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-800
                      ${collaborator.user.id === user.id
                        ? 'ring-2 ring-yellow-500 z-10'
                        : collaborator.is_active ? 'ring-2 ring-sky-400' : 'opacity-50'}
                        `}
                    // title={collaborator.user.name}
                    style={{ cursor: 'pointer' }}
                  />
                </TooltipTrigger>
                <TooltipContent side='bottom'>{collaborator.user.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
          {/* <Badge className="bg-green-500 text-white" variant="secondary"> */}
          {/* {collaborators?.length} usuarios */}
          {/* </Badge> */}
        </div>
      </div>

      <div
        className="flex-1 overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={canvasRef}
          className="w-full h-full canvas-grid bg-light-bg-secondary dark:bg-zinc-800 relative"
          style={{
            cursor: activeTool === 'pan' ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleCanvasClick}
        >
          <div
            className="absolute origin-top-left"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              width: '100%',
              height: '100%'
            }}
          >
            {canvasElements.map((element: CanvasElement) =>
              generateElement(
                element,
                selectedElement,
                onSelectElement,
                activeTool,
                handleElementMouseDown,
                handleResizeStart
              )
            )}

            {collaborators?.filter((col: any) => col.is_active).map((collaborator: any) => collaborator.user.id !== user.id && collaborator.cursor_x !== 0 && collaborator.cursor_y !== 0 && (
              <div
                key={`cursor-${collaborator.id}`}
                className="absolute pointer-events-none z-10"
                style={{
                  left: `${collaborator.cursor_x}px`,
                  top: `${collaborator.cursor_y}px`
                  // left: `${500}px`,
                  // top: `${500}px`
                }}
              >
                <div className="relative">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    // style={{ color: '#aaa' }}
                    className='text-sky-900'
                  >
                    <path
                      d="M5 2L19 16L12 16L5 23V2Z"
                      fill="currentColor"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </svg>
                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-0.5 rounded text-xs whitespace-nowrap text-sky-300 bg-sky-900/50"
                  // style={{ backgroundColor: '#' }}
                  >
                    {collaborator.user.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div >
  )
}
