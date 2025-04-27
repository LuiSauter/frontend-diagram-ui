import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Search,
  Layout,
  Type,
  Settings,
  Table
} from 'lucide-react'
import { type CanvasElement } from '../pages/sheet-page'

interface ComponentGroup {
  id: string
  name: string
  icon: React.ReactNode
  components: CanvasElement[]
}

// export interface Component {
//   id: string
//   name: string
//   type: string
//   preview?: React.ReactNode
//   position?: { x: number, y: number }
//   isBeingDragged?: boolean
//   style?: Record<string, any>
//   properties?: Record<string, any>
//   children?: Component[] | string[]
// }

const componentGroups: ComponentGroup[] = [
  {
    id: 'layout',
    name: 'Layout',
    icon: <Layout className="h-4 w-4" />,
    components: [
      {
        id: 'main-container',
        name: 'Contenedor principal',
        type: 'main',
        preview: (
          <div className="flex h-10 w-full border border-dashed bg-transparent rounded border-blue-300 dark:border-sky-500">
          </div>
        ),
        style: {
          backgroundColor: 'transparent',
          width: 300,
          height: 500,
          widthUnit: 'px',
          heightUnit: 'px',
          zIndex: 1,
          borderWidth: '1px',
          borderStyle: 'dashed',
          borderColor: '#d1d5db'
        },
        properties: {},
        children: [{
          id: 'flex-container',
          name: 'Contenedor flex',
          type: 'section',
          style: {
            display: 'flex',
            flexDirection: 'column',
            // gap: '8px',
            // padding: '16px',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            width: 100,
            height: 100,
            widthUnit: '%',
            heightUnit: '%',
            backgroundColor: '#ffffff',
            zIndex: 2
          },
          properties: {},
          children: [],
          position: {
            x: 0,
            y: 0
          }
        }],
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'container-grid',
        name: 'Contenedor grid',
        type: 'section',
        preview: (
          <div className="grid grid-cols-2 gap-1 w-full h-10 bg-green-100 dark:bg-green-900 rounded border border-green-300 dark:border-green-700">
            <div className="bg-white h-full w-full rounded dark:bg-dark-bg-secondary"></div>
            <div className="bg-white h-full w-full rounded dark:bg-dark-bg-secondary"></div>
          </div>
        ),
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          backgroundColor: '#ffffff',
          width: 300,
          height: 500,
          widthUnit: 'px',
          heightUnit: 'px',
          zIndex: 2
        },
        properties: {},
        children: [],
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'section',
        name: 'Sección',
        type: 'section',
        preview: (
          <section className="h-10 w-full bg-gray-100 dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700">
          </section>
        ),
        style: {
          backgroundColor: '#ffffff',
          width: 300,
          height: 500,
          widthUnit: 'px',
          heightUnit: 'px'
        },
        properties: {},
        children: [],
        position: {
          x: 0,
          y: 0
        }
      }
    ]
  },
  {
    id: 'ui',
    name: 'UI',
    icon: <Settings className="h-4 w-4" />,
    components: [
      {
        id: 'button',
        name: 'Button',
        type: 'button',
        preview: (
          <button className="px-4 py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
            Botón
          </button>
        ),
        style: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderRadius: '8px',
          padding: '8px 16px',
          width: 150,
          height: 40,
          widthUnit: 'px',
          heightUnit: 'px'
        },
        properties: {
          type: 'button'
        },
        children: 'Botón',
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'input',
        name: 'Input',
        type: 'input',
        preview: (
          <input className="border p-2 rounded w-full text-sm" placeholder="Escribir..." />
        ),
        style: {
          borderWidth: '1px',
          borderColor: '#d1d5db',
          borderRadius: '8px',
          padding: '8px 16px',
          width: 150,
          height: 40,
          widthUnit: 'px',
          heightUnit: 'px'
        },
        properties: {
          type: 'text',
          placeholder: 'Escribir...',
          disabled: false,
          defaultValue: 'Hola mundo'
        },
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'checkbox',
        name: 'Checkbox',
        type: 'input',
        preview: (
          <div className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4" />
            <span className="text-sm">Seleccionar</span>
          </div>
        ),
        style: {},
        properties: {
          type: 'checkbox',
          defaultChecked: true
        },
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'progress',
        name: 'Progress',
        type: 'progress',
        preview: (
          <progress className="w-full h-2" value="50" max="100"></progress>
        ),
        style: {
          width: 190,
          height: 8,
          widthUnit: 'px',
          heightUnit: 'px'
        },
        properties: {
          value: 50,
          max: 100
        },
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'select',
        name: 'Select',
        type: 'select',
        preview: (
          <select className="border p-2 rounded text-sm w-full">
            <option>Opción 1</option>
            <option>Opción 2</option>
          </select>
        ),
        style: {
          borderWidth: '1px',
          borderColor: '#d1d5db',
          borderRadius: '8px',
          padding: '8px 16px',
          width: 150,
          height: 40,
          widthUnit: 'px',
          heightUnit: 'px'
        },
        properties: {},
        children: [
          {
            id: 'option-1',
            name: 'Option 1',
            type: 'option',
            properties: {},
            preview: <option>Opción 1</option>,
            children: 'Opción 1',
            style: {},
            position: {
              x: 0,
              y: 0
            }
          },
          {
            id: 'option-2',
            name: 'Option 2',
            type: 'option',
            properties: {},
            preview: <option>Opción 2</option>,
            children: 'Opción 2',
            style: {},
            position: {
              x: 0,
              y: 0
            }
          }
        ],
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'radio',
        name: 'Radio Button',
        type: 'input',
        preview: (
          <div className="flex items-center gap-2">
            <input type="radio" className="h-4 w-4" />
            <span className="text-sm">Opción</span>
          </div>
        ),
        style: {},
        properties: {
          type: 'radio',
          name: 'radio-group',
          disabled: false
        },
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'image',
        name: 'Image',
        type: 'img',
        preview: (
          <img
            className="rounded w-full h-16 object-cover"
            src="https://cdn.pixabay.com/photo/2015/12/22/04/00/photo-1103594_1280.png"
            alt="Imagen" />
        ),
        style: {
          width: 200,
          height: 200,
          widthUnit: 'px',
          heightUnit: 'px',
          objectFit: 'contain',
          borderRadius: '8px'
        },
        properties: {
          src: 'https://cdn.pixabay.com/photo/2015/12/22/04/00/photo-1103594_1280.png',
          alt: 'Imagen de ejemplo'
        },
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'calendar',
        name: 'Calendar',
        type: 'input',
        preview: (
          <input type="date" className="border p-2 rounded text-sm w-full" />
        ),
        style: {
          borderWidth: '1px',
          borderColor: '#d1d5db',
          borderRadius: '8px',
          padding: '8px 16px',
          width: 150,
          height: 40,
          widthUnit: 'px',
          heightUnit: 'px'
        },
        properties: {
          type: 'date'
        },
        position: {
          x: 0,
          y: 0
        }
      }
    ]
  },
  {
    id: 'text',
    name: 'Text',
    icon: <Type className="h-4 w-4" />,
    components: [
      {
        id: 'heading-h1',
        name: 'Heading H1',
        type: 'h1',
        preview: <h1 className="text-3xl font-bold">Título H1</h1>,
        style: {
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#000000'
        },
        properties: {},
        children: 'Título H1',
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'paragraph',
        name: 'Paragraph',
        type: 'p',
        preview: <p className="text-base">Este es un párrafo de texto normal.</p>,
        style: {
          fontSize: '1rem',
          color: '#000000'
        },
        properties: {},
        children: 'Este es un párrafo de texto normal.',
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'badge',
        name: 'Badge',
        type: 'span',
        preview: (
          <span className="inline-block px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded-full">
            Badge
          </span>
        ),
        style: {
          backgroundColor: '#bfdbfe',
          color: '#1e40af',
          fontSize: '0.75rem',
          padding: '4px 8px',
          borderRadius: '16px'
        },
        properties: {},
        children: 'Badge',
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'label',
        name: 'Label',
        type: 'label',
        preview: <label className="text-sm font-medium">Etiqueta</label>,
        style: {
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#000000'
        },
        properties: {
          htmlFor: ''
        },
        children: 'Etiqueta',
        position: {
          x: 0,
          y: 0
        }
      }
    ]
  },
  {
    id: 'data',
    name: 'Data',
    icon: <Table className="h-4 w-4" />,
    components: [
      {
        id: 'table',
        name: 'Table',
        type: 'table',
        preview: (
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr>
                <th className="border px-4 py-2">Encabezado 1</th>
                <th className="border px-4 py-2">Encabezado 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Dato 1</td>
                <td className="border px-4 py-2">Dato 2</td>
              </tr>
            </tbody>
          </table>
        ),
        style: {
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem'
        },
        properties: {},
        children: [
          {
            id: 'thead',
            name: 'Table Head',
            type: 'thead',
            preview: (
              <thead>
                <tr>
                  <th>Encabezado 1</th>
                  <th>Encabezado 2</th>
                </tr>
              </thead>
            ),
            style: {},
            properties: {},
            position: {
              x: 0,
              y: 0
            }
          },
          {
            id: 'tbody',
            name: 'Table Body',
            type: 'tbody',
            preview: (
              <tbody>
                <tr>
                  <td>Dato 1</td>
                  <td>Dato 2</td>
                </tr>
              </tbody>
            ),
            style: {},
            properties: {},
            position: {
              x: 0,
              y: 0
            }
          }
        ],
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'unordered-list',
        name: 'Unordered List (UL)',
        type: 'ul',
        preview: (
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Elemento 1</li>
            <li>Elemento 2</li>
          </ul>
        ),
        style: {
          paddingLeft: '20px',
          listStyleType: 'disc',
          fontSize: '0.875rem'
        },
        properties: {},
        children: [
          {
            id: 'list-item-ul-1',
            name: 'List Item',
            type: 'li',
            preview: <li>Elemento 1</li>,
            style: {},
            properties: {},
            position: {
              x: 0,
              y: 0
            }
          },
          {
            id: 'list-item-ul-2',
            name: 'List Item',
            type: 'li',
            preview: <li>Elemento 2</li>,
            style: {},
            properties: {},
            position: {
              x: 0,
              y: 0
            }
          }
        ],
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'ordered-list',
        name: 'Ordered List (OL)',
        type: 'ol',
        preview: (
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>Elemento 1</li>
            <li>Elemento 2</li>
          </ol>
        ),
        style: {
          paddingLeft: '20px',
          listStyleType: 'decimal',
          fontSize: '0.875rem'
        },
        properties: {},
        children: [
          {
            id: 'list-item-ol-1',
            name: 'List Item',
            type: 'li',
            preview: <li>Elemento 1</li>,
            style: {},
            properties: {},
            position: {
              x: 0,
              y: 0
            }
          },
          {
            id: 'list-item-ol-2',
            name: 'List Item',
            type: 'li',
            preview: <li>Elemento 2</li>,
            style: {},
            properties: {},
            position: {
              x: 0,
              y: 0
            }
          }
        ],
        position: {
          x: 0,
          y: 0
        }
      }
    ]
  }
]

interface ComponentPanelProps {
  onDragComponent: (component: CanvasElement) => void
}

export function ComponentPanel({ onDragComponent }: ComponentPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('layout')

  const handleDragStart = (e: React.DragEvent, component: CanvasElement) => {
    e.dataTransfer.setData('componentId', JSON.stringify(component))
    if (onDragComponent) {
      onDragComponent(component)
    }
  }

  const filteredGroups = componentGroups
    .map((group) => ({
      ...group,
      components: group.components.filter(
        (component) =>
          component.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter((group) => group.components.length > 0)

  return (
    <div className="h-full flex flex-col ">
      <div className="p-3 ">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar componentes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
            className="pl-8 h-9"
          />
        </div>
      </div>

      {searchQuery
        ? (
          <ScrollArea className="flex-1">
            <div className="p-3">
              <h3 className="text-sm font-medium mb-2">Resultados</h3>
              {filteredGroups.map((group) => (
                <div key={group.id} className="mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                    {group.icon}
                    <span>{group.name}</span>
                  </div>
                  <div className="space-y-2">
                    {group.components.map((component) => (
                      <div
                        key={component.id}
                        className="p-2 bg-background rounded-md border cursor-move hover:border-primary"
                        draggable
                        onDragStart={(e) => {
                          handleDragStart(e, component)
                        }}
                      >
                        <div className="text-xs font-medium mb-1">
                          {component.name}
                        </div>
                        <div className="h-10 flex items-center justify-center">
                          {component.preview}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>)
        : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid grid-cols-5 bg-transparent rounded-lg">
              {componentGroups.map((group) => (
                <TabsTrigger
                  key={group.id}
                  value={group.id}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-none flex flex-col text-xs py-2 gap-0.5"
                >
                  {group.icon}
                  <span>{group.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {componentGroups.map((group) => (
              <TabsContent
                key={group.id}
                value={group.id}
                className="flex-1 p-0 mt-0"
              >
                <ScrollArea className="h-[calc(100dvh-300px)]">
                  <div className="grid grid-cols-1 gap-4">
                    {group.components.map((component) => (
                      <div
                        key={component.id}
                        className="bg-transparent rounded-md cursor-move"
                        draggable
                        onDragStart={(e) => {
                          handleDragStart(e, component)
                        }}
                      >
                        <div
                          className="text-xs font-medium mb-1"
                        >
                          {component.name}
                        </div>
                        <div
                          className="h-fit flex items-center relative shrink-0 justify-center w-full"
                        >
                          {component.preview}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>)}
    </div>
  )
}
