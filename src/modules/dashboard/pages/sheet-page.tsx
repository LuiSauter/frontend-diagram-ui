import { setProjectOpen, setSheetOpen } from '@/redux/slices/workspace.slice'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { toast } from 'sonner'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertiesPanel } from '../components/properties-panel'

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
  properties: Record<string, any>
  style: Record<string, any>
  children?: CanvasElement[] | null
}

const SheetPage = () => {
  const { sheetId, projectId } = useParams()
  const dispatch = useDispatch()
  // const { workspace } = useSelector((state: RootState) => state.workspace)
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([])
  const [workspace, setWorkspace] = useState<any>(null)
  // const [selectedFile, setSelectedFile] = useState<any>(null)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [codeExample, setCodeExample] = useState(initialCodeExample)
  const [_draggedElement, setDraggedElement] = useState<string | null>(null) // _ no se usa aun

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

  const handleSelectCanvasElement = (elementId: string | null) => {
    setSelectedElement(elementId)
  }

  const handleDropComponent = (component: any, position: { x: number, y: number }) => {
    const newElement: CanvasElement = {
      id: `${component.id}-${Date.now()}`,
      type: component.element,
      position,
      name: component.name,
      properties: component.properties,
      style: component.style,
      children: component.children
        ? component.children.map((child: any) => {
          if (typeof child === 'string') {
            return child
          }
          // console.log(child)
          return ({
            id: `${child.id}-${Date.now()}`,
            type: child.element,
            name: child.name,
            position: { x: 0, y: 0 },
            properties: child.properties,
            style: child.style,
            children: child.children as ['string'] | null
          })
        })
        : null
    }

    setCanvasElements([...canvasElements, newElement])
    setSelectedElement(newElement.id)

    updateCodeExample(newElement)
  }

  const handleMoveElement = (elementId: string, newPosition: { x: number, y: number }) => {
    setCanvasElements(elements =>
      elements.map(element =>
        element.id === elementId
          ? { ...element, position: newPosition }
          : element
      )
    )
  }

  const handleResizeElement = (elementId: string, newSize: { width: number, height: number }) => {
    console.log(elementId, newSize)
    setCanvasElements(elements =>
      elements.map(element =>
        element.id === elementId
          ? {
              ...element,
              style: {
                ...element.style,
                width: newSize.width,
                height: newSize.height
              }
            }
          : element
      )
    )
  }

  const updateCodeExample = (element: CanvasElement) => {
    setCodeExample({
      ...codeExample,
      typescript: codeExample.typescript + `\n\n// Added new ${element.type} component with id ${element.id}`
    })
  }

  const handleUpdateElementProperties = (elementId: string, style: Record<string, any>) => {
    setCanvasElements((elements) =>
      elements.map((element) =>
        element.id === elementId
          ? { ...element, style: { ...element.style, ...style } }
          : { ...element, children: element.children ? element.children.map((child) => child.id === elementId ? { ...child, style: { ...child.style, ...style } } : child) : null }
      )
    )

    const element = canvasElements.find(e => e.id === elementId)
    if (element) {
      updateCodeExample({ ...element, style: { ...element.style, ...style } })
    }
  }

  const handleElementDragStart = (elementId: string) => {
    setDraggedElement(elementId)
    setCanvasElements(elements =>
      elements.map(element =>
        element.id === elementId
          ? { ...element, isBeingDragged: true }
          : element
      )
    )
  }

  const handleElementDragEnd = () => {
    setDraggedElement(null)
    setCanvasElements(elements =>
      elements.map(element =>
        element.isBeingDragged
          ? { ...element, isBeingDragged: false }
          : element
      )
    )
  }

  const handleElementDelete = (elementId: string) => {
    console.log(elementId)
    setCanvasElements(elements => elements.filter(element => element.id !== elementId))
    if (selectedElement === elementId) {
      setSelectedElement(null)
    }
    toast.info('Componente eliminado')
  }

  const getSelectedElementData = () => {
    if (!selectedElement) return null
    const element = canvasElements.find(e => e.id === selectedElement) ??
      canvasElements.flatMap(e => e.children ?? []).find(e => e.id === selectedElement)
    if (!element) return null
    return {
      id: element.id,
      type: element.type,
      style: element.style
    }
  }

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
            collaborators={mockCollaborators}
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
