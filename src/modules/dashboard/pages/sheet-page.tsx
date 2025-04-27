import { setProjectOpen, setSheetOpen } from '@/redux/slices/workspace.slice'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertiesPanel } from '../components/properties-panel'
import { useCreateResource, useGetResource } from '@/hooks/useApiResource'
import { socket } from '@/config/socket'
// import { useGetResource } from '@/hooks/useApiResource'

const MOCK_WORKSPACES = [
  {
    id: 'workspace-1',
    name: 'Proyecto E-commerce',
    updated: new Date(2025, 3, 5),
    collaborators: 3,
    files: 12
  },
  {
    id: 'workspace-2',
    name: 'Aplicación Bancaria',
    updated: new Date(2025, 3, 8),
    collaborators: 5,
    files: 8
  },
  {
    id: 'workspace-3',
    name: 'Dashboard Analítico',
    updated: new Date(2025, 3, 10),
    collaborators: 2,
    files: 5
  },
  {
    id: 'workspace-4',
    name: 'Rediseño Portal Corporativo',
    updated: new Date(2025, 3, 1),
    collaborators: 4,
    files: 15
  }
]

export const ELEMENTS_WITH_CHILDREN = [
  'div', 'section', 'main', 'article', 'aside', 'header',
  'footer', 'nav', 'ul', 'ol', 'li', 'form'
  // 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
]

export const ELEMENTS_WITHOUT_CHILDREN = [
  'img', 'input', 'button', 'select', 'textarea', 'hr',
  'br', 'link', 'meta', 'script', 'style',
  'svg', 'canvas', 'video', 'audio', 'iframe',
  'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'em', 'b', 'i', 'u', 'mark', 'small'
]

interface Collaborator {
  id: string
  name: string
  color: string
  position?: {
    x: number
    y: number
  }
}

const mockCollaborators: Collaborator[] = [
  { id: 'user-1', name: 'María González', color: '#F97316' },
  { id: 'user-2', name: 'Carlos Rodríguez', color: '#8B5CF6' },
  { id: 'user-3', name: 'Ana Martínez', color: '#10B981' }
]

// Initially position the collaborators' cursors at random positions
mockCollaborators.forEach(collaborator => {
  collaborator.position = {
    x: Math.random() * 800,
    y: Math.random() * 600
  }
})

const initialCodeExample = {
  html: `<div class="product-card">
  <img [src]="product.imageUrl" [alt]="product.name" class="product-image">
  <div class="product-details">
    <h3 class="product-name">{{ product.name }}</h3>
    <p class="product-description">{{ product.description }}</p>
    <div class="product-price">{{ product.price | currency }}</div>
    <button (click)="addToCart()" class="add-to-cart-button">
      Añadir al carrito
    </button>
  </div>
</div>`,
  css: `.product-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-details {
  padding: 16px;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.product-description {
  color: #666;
  margin-bottom: 12px;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #e53e3e;
  margin-bottom: 12px;
}

.add-to-cart-button {
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: medium;
  transition: background-color 0.2s;
}

.add-to-cart-button:hover {
  background-color: #2c5282;
}`,
  typescript: `import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product: Product;
  
  constructor(private cartService: CartService) {}
  
  addToCart(): void {
    this.cartService.addToCart(this.product);
  }
}`
}

export interface CanvasElement {
  id: string
  type: string
  name?: string
  position: { x: number, y: number }
  isBeingDragged?: boolean
  preview?: React.ReactNode
  properties: Record<string, any>
  style: Record<string, any>
  children?: CanvasElement[] | string
}

export const findElementInTreeWithPath = (
  elements: CanvasElement[],
  elementId: string,
  path: string[] = []
): { element: CanvasElement, path: string[] } | null => {
  for (const element of elements) {
    const currentPath = [...path, element.id]

    if (element.id === elementId) {
      return { element, path: currentPath }
    }

    if (element.children && Array.isArray(element.children)) {
      if (element.children.length > 0 && typeof element.children[0] !== 'string') {
        const found = findElementInTreeWithPath(element.children, elementId, currentPath)
        if (found) {
          return found
        }
      }
    }
  }
  return null
}

const SheetPage = () => {
  const { sheetId, projectId } = useParams()
  const dispatch = useDispatch()
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([])
  const [workspace, setWorkspace] = useState<any>(null)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [codeExample, setCodeExample] = useState(initialCodeExample)
  const [_draggedElement, setDraggedElement] = useState<string | null>(null) // _ no se usa aun
  const { resource: sheet } = useGetResource<any>({ endpoint: `/api/workspace/sheet/${sheetId}` })
  const { createResource: saveVersion } = useCreateResource({ endpoint: `/api/workspace/sheet/${sheetId}/save-version` })

  useEffect(() => {
    if (sheet) {
      const data = JSON.parse(String(sheet?.versions[0].data))
      setCanvasElements(data.canvasElements as CanvasElement[])
    }
    sheet && socket.on(`sheet/${sheet.id}/version`, (data: any) => {
      // setCollaborators(data.colaboration_session?.session_participants)
      setCanvasElements(JSON.parse(String(data.versions[0].data)).canvasElements as CanvasElement[])
    })
    return () => {
      sheet && socket.off(`sheet/${sheet.id}/version`)
    }
  }, [socket, sheet])

  useEffect(() => {
    dispatch(setSheetOpen(sheetId))
    dispatch(setProjectOpen(projectId))
    return () => {
      // dispatch(setSheetOpen(false))
    }
  }, [sheetId])

  useEffect(() => {
    const foundWorkspace = MOCK_WORKSPACES.find(w => w.id === 'workspace-1')
    if (foundWorkspace) {
      setWorkspace(foundWorkspace)
    } else {
      // navigate('/dashboard')
    }
  }, [])

  if (!workspace) {
    return <div>Cargando...</div>
  }

  // const handleSelectFile = (file: any) => {
  //   setSelectedFile(file)
  //   toast.info(`Archivo seleccionado: ${file.name}`)
  // }

  // const handleRenameWorkspace = (newName: string) => {
  //   setWorkspace({ ...workspace, name: newName })
  // }

  // const handleSaveWorkspace = () => {
  //   toast.success('Cambios guardados correctamente')
  // }

  // const handlePreviewWorkspace = () => {
  //   toast.info('Abriendo vista previa en una nueva ventana...')
  // }

  // const handleExportWorkspace = () => {
  //   toast.success('Proyecto exportado como código Angular')
  // }

  // Función recursiva para encontrar y modificar elementos
  const updateElementInTree = (
    elements: CanvasElement[],
    elementId: string,
    updater: (element: CanvasElement) => CanvasElement
  ): CanvasElement[] => {
    return elements.map(element => {
      if (element.id === elementId) {
        return updater(element)
      }

      if (element.children && Array.isArray(element.children) && element.children.length > 0) {
        const isChildrenComponents = typeof element.children[0] !== 'string'

        if (isChildrenComponents) {
          return {
            ...element,
            children: updateElementInTree(element.children, elementId, updater)
          }
        }
      }

      return element
    })
  }

  const deleteElementFromTree = (elements: CanvasElement[], elementId: string): CanvasElement[] => {
    return elements
      .filter(element => element.id !== elementId)
      .map(element => {
        if (element.children && Array.isArray(element.children) && element.children.length > 0) {
          const isChildrenComponents = typeof element.children[0] !== 'string'

          if (isChildrenComponents) {
            return {
              ...element,
              children: deleteElementFromTree(element.children, elementId)
            }
          }
        }
        return element
      })
  }

  const handleSelectCanvasElement = (elementId: string | null) => {
    setSelectedElement(elementId)
  }

  const handleDropComponent = (
    component: CanvasElement,
    position: { x: number, y: number },
    parentId: string
  ) => {
    const canAcceptChildren = (elements: CanvasElement[], targetId: string): boolean => {
      for (const element of elements) {
        if (element.id === targetId) {
          return ELEMENTS_WITH_CHILDREN.includes(element.type)
        }

        if (element.children && Array.isArray(element.children)) {
          const result = canAcceptChildren(element.children, targetId)
          if (result) return true
        }
      }
      return false
    }

    const effectiveParentId = parentId && canAcceptChildren(canvasElements, parentId)
      ? parentId
      : ''

    const normalizeChildren = (children: CanvasElement[] | null): any => {
      if (!children) return null

      if (children.length > 0 && typeof children[0] === 'string') {
        return children
      }

      return children.map(child => ({
        id: `${child.type}-${Date.now()}`,
        type: child.type,
        name: child.name ?? '',
        position: { x: 0, y: 0 },
        properties: child.properties ?? {},
        style: child.style ?? {},
        children: normalizeChildren(child.children as CanvasElement[]),
        isBeingDragged: false
      }))
    }

    const newElement: CanvasElement = {
      id: `${component.type}-${Date.now()}`,
      type: component.type,
      position: effectiveParentId ? { x: 0, y: 0 } : position,
      name: component.name ?? '',
      properties: component.properties ?? {},
      style: component.style ?? {},
      isBeingDragged: false,
      children: normalizeChildren(component.children as CanvasElement[])
    }

    const addToParent = (
      elements: CanvasElement[],
      targetId: string,
      elementToAdd: CanvasElement
    ): CanvasElement[] => {
      return elements.map(element => {
        if (element.id === targetId) {
          return {
            ...element,
            children: [
              ...(Array.isArray(element.children) ? element.children : []),
              elementToAdd
            ] as CanvasElement[]
          }
        }

        if (element.children &&
          Array.isArray(element.children) &&
          element.children.length > 0 &&
          typeof element.children[0] !== 'string') {
          return {
            ...element,
            children: addToParent(element.children, targetId, elementToAdd)
          }
        }

        return element
      })
    }

    if (effectiveParentId) {
      setCanvasElements(prevElements => {
        const updatedElements = addToParent(prevElements, effectiveParentId, newElement)
        void saveVersion({ version: JSON.stringify(updatedElements) })
        return updatedElements
      })
    } else {
      setCanvasElements(prev => {
        const newElements = [...prev, newElement]
        void saveVersion({ version: JSON.stringify(newElements) })
        return newElements
      })
    }
    console.log('handleDropComponent')

    setSelectedElement(newElement.id)
    updateCodeExample(newElement)

    // toast.success(
    //   effectiveParentId
    //     ? `Componente agregado dentro de ${newElement.type}`
    //     : 'Componente agregado al canvas'
    // )
  }

  const handleMoveElement = (elementId: string, newPosition: { x: number, y: number }) => {
    setCanvasElements(elements =>
      updateElementInTree(elements, elementId, element => ({
        ...element,
        position: newPosition
      }))
    )
    // console.log('handleMoveElement') TODO: cuidado
  }

  const handleResizeElement = (elementId: string, newSize: { width: number, height: number }) => {
    setCanvasElements(elements =>
      updateElementInTree(elements, elementId, element => ({
        ...element,
        style: {
          ...element.style,
          width: newSize.width,
          height: newSize.height
        }
      }))
    )
  }

  const updateCodeExample = (element: CanvasElement) => {
    setCodeExample({
      ...codeExample,
      typescript: codeExample.typescript + `\n\n// Added new ${element.type} component with id ${element.id}`
    })
  }

  const handleUpdateElementProperties = (elementId: string, style: Record<string, any>, children: any) => {
    setCanvasElements(elements => {
      const updated = updateElementInTree(elements, elementId, element => ({ ...element, style: { ...element.style, ...style }, children }))
      void saveVersion({ version: JSON.stringify(updated) })
      return updated
    })

    console.log('handleUpdateElementProperties')

    const findElementInTree = (elements: CanvasElement[]): CanvasElement | null => {
      for (const element of elements) {
        if (element.id === elementId) return element

        if (element.children && Array.isArray(element.children) && element.children.length > 0) {
          const isChildrenComponents = typeof element.children[0] !== 'string'
          if (isChildrenComponents) {
            const found = findElementInTree(element.children)
            if (found) return found
          }
        }
      }
      return null
    }

    const element = findElementInTree(canvasElements)
    if (element) {
      updateCodeExample({ ...element, style: { ...element.style, ...style } })
    }
  }

  const handleElementDragStart = (elementId: string) => {
    setDraggedElement(elementId)
    setCanvasElements(elements =>
      updateElementInTree(elements, elementId, element => ({
        ...element,
        isBeingDragged: true
      }))
    )
    // console.log('handleElementDragStart') TODO: cuidado
  }

  const handleElementDragEnd = () => {
    setDraggedElement(null)
    setCanvasElements(elements => {
      const updated = elements.map(element => ({
        ...element,
        isBeingDragged: false,
        children: element.children && Array.isArray(element.children) && typeof element.children[0] !== 'string'
          ? (element.children).map((child: any) => ({ ...child, isBeingDragged: false }))
          : element.children
      }))
      void saveVersion({ version: JSON.stringify(updated) })
      return updated
    })
    console.log('handleElementDragEnd')
  }

  const handleElementDelete = (elementId: string) => {
    setCanvasElements(elements => {
      const updated = deleteElementFromTree(elements, elementId)
      void saveVersion({ version: JSON.stringify(updated) })
      return updated
    })
    console.log('handleElementDelete')
    if (selectedElement === elementId) {
      setSelectedElement(null)
    }
  }

  const getSelectedElementData = (): any => {
    if (!selectedElement) return null

    const findElementInTree = (elements: CanvasElement[]): CanvasElement | null => {
      for (const element of elements) {
        if (element.id === selectedElement) return element

        if (element.children && Array.isArray(element.children) && element.children.length > 0) {
          const isChildrenComponents = typeof element.children[0] !== 'string'
          if (isChildrenComponents) {
            const found = findElementInTree(element.children)
            if (found) return found
          }
        }
      }
      return null
    }

    const element = findElementInTree(canvasElements)
    return element
      ? { id: element.id, type: element.type, style: element.style, properties: element.properties, children: element.children }
      : null
  }

  // crear un debounce para guardar canvasElements en saveVersion en base de datos
  // const [debouncedCanvasElements, setDebouncedCanvasElements] = useState<CanvasElement[]>([])

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedCanvasElements(canvasElements)
  //   }, 1000) // Adjust debounce delay as needed

  //   return () => {
  //     clearTimeout(handler)
  //   }
  // }, [canvasElements])

  // useEffect(() => {
  //   const saveCanvasElements = async () => {
  //     if (debouncedCanvasElements.length > 0) {
  //       // await saveVersion({ version: JSON.stringify(debouncedCanvasElements) })
  //       // toast.success('Cambios guardados correctamente')
  //       console.log(debouncedCanvasElements)
  //     }
  //   }

  //   void saveCanvasElements()
  // }, [debouncedCanvasElements])

  return (
    <div className='w-full h-full flex flex-col'>
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={55}>
          <Canvas
            canvasElements={canvasElements}
            selectedElement={selectedElement}
            onSelectElement={handleSelectCanvasElement}
            onDropComponent={handleDropComponent}
            onMoveElement={handleMoveElement}
            onResizeElement={handleResizeElement}
            onElementDragStart={handleElementDragStart}
            onElementDragEnd={handleElementDragEnd}
            onElementDelete={handleElementDelete}
          // collaborators={resource ? resource.colaboration_session.session_participants : []}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={20} minSize={25} maxSize={35}>
          <Tabs defaultValue="properties" className="p-4 h-full bg-light-bg-secondary dark:bg-dark-bg-secondary">
            <TabsList className="grid grid-cols-1 bg-light-bg-secondary dark:bg-dark-bg-secondary">
              <TabsTrigger value="properties" className="w-full">
                Propiedades
              </TabsTrigger>
              {/* <TabsTrigger value="code" className="">
                ...
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="properties" className="flex-1 p-0 m-0">
              <PropertiesPanel
                selectedComponent={getSelectedElementData()}
                onUpdateProperties={handleUpdateElementProperties}
                onDeselectComponent={() => { setSelectedElement(null) }}
              />
            </TabsContent>

            <TabsContent value="code" className="flex-1 p-0 m-0">
              {/* <CodePanel componentCode={codeExample} /> */}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default SheetPage
