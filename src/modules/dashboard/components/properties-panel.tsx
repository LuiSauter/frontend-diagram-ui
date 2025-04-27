import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Paintbrush, Box, MousePointer, Type, Layers } from 'lucide-react'

interface SelectedComponent {
  id: string
  type: string
  style: Record<string, any>
}

interface PropertiesPanelProps {
  selectedComponent: SelectedComponent | null
  onUpdateProperties: (id: string, properties: Record<string, any>) => void
  onDeselectComponent: () => void
}

export function PropertiesPanel({
  selectedComponent,
  onUpdateProperties
  // onDeselectComponent
}: PropertiesPanelProps) {
  if (!selectedComponent) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-medium">Propiedades</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm p-4 text-center">
          Selecciona un componente para ver y editar sus propiedades
        </div>
      </div>
    )
  }

  const handlePropertyChange = (property: string, value: any) => {
    onUpdateProperties(selectedComponent.id, {
      ...selectedComponent.style,
      [property]: value
    })
  }

  return (
    <div className="h-full flex flex-col ">
      <div className="py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-sm font-medium">{selectedComponent.type}</h3>
          <span className="text-xs text-muted-foreground">#{selectedComponent.id}</span>
        </div>
        {/* <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onDeselectComponent}>
          <X className="h-4 w-4" />
        </Button> */}
      </div>

      <Tabs defaultValue="style">
        <TabsList className="grid grid-cols-5 bg-transparent">
          <TabsTrigger value="style" className="data-[state=active]:bg-background data-[state=active]:shadow-none flex flex-col text-xs py-1 gap-0.5">
            <Paintbrush className="h-4 w-4" />
            <span>Estilo</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="data-[state=active]:bg-background data-[state=active]:shadow-none flex flex-col text-xs py-1 gap-0.5">
            <Box className="h-4 w-4" />
            <span>Layout</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="data-[state=active]:bg-background data-[state=active]:shadow-none flex flex-col text-xs py-1 gap-0.5">
            <Type className="h-4 w-4" />
            <span>Texto</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-background data-[state=active]:shadow-none flex flex-col text-xs py-1 gap-0.5">
            <MousePointer className="h-4 w-4" />
            <span>Eventos</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-background data-[state=active]:shadow-none flex flex-col text-xs py-1 gap-0.5">
            <Layers className="h-4 w-4" />
            <span>Más</span>
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="style" className="py-4 space-y-4 m-0">
            {/* Color Section */}
            <div>
              <h4 className="text-sm font-medium mb-2">Color</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="bg-color" className="text-xs">Fondo</Label>
                    <div className="flex">
                      <div
                        className="w-6 h-6 border rounded-l"
                        style={{
                          backgroundColor: selectedComponent.style.backgroundColor || '#ffffff'
                        }}
                      />
                      <Input
                        id="bg-color"
                        value={selectedComponent.style.backgroundColor || '#ffffff'}
                        onChange={(e) => { handlePropertyChange('backgroundColor', e.target.value) }}
                        className="rounded-l-none h-6 text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="text-color" className="text-xs">Texto</Label>
                    <div className="flex">
                      <div
                        className="w-6 h-6 border rounded-l"
                        style={{
                          backgroundColor: selectedComponent.style.color || '#000000'
                        }}
                      />
                      <Input
                        id="text-color"
                        value={selectedComponent.style.color || '#000000'}
                        onChange={(e) => { handlePropertyChange('color', e.target.value) }}
                        className="rounded-l-none h-6 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Border Section */}
            <div>
              <h4 className="text-sm font-medium mb-2">Borde</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Grosor</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[selectedComponent.style.borderWidth || 0]}
                        min={0}
                        max={10}
                        step={1}
                        onValueChange={(value) => { handlePropertyChange('borderWidth', value[0]) }}
                        className="flex-1 ml-2"
                      />
                      <span className="text-xs w-6 text-center">
                        {selectedComponent.style.borderWidth || 0}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Radio</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[selectedComponent.style.borderRadius || 0]}
                        min={0}
                        max={20}
                        step={1}
                        onValueChange={(value) => { handlePropertyChange('borderRadius', value[0]) }}
                        className="flex-1 ml-2"
                      />
                      <span className="text-xs w-6 text-center">
                        {selectedComponent.style.borderRadius || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="border-color" className="text-xs">Color del borde</Label>
                  <div className="flex">
                    <div
                      className="w-6 h-6 border rounded-l"
                      style={{
                        backgroundColor: selectedComponent.style.borderColor || '#cccccc'
                      }}
                    />
                    <Input
                      id="border-color"
                      value={selectedComponent.style.borderColor || '#cccccc'}
                      onChange={(e) => { handlePropertyChange('borderColor', e.target.value) }}
                      className="rounded-l-none h-6 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shadow Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Sombra</h4>
                <Switch
                  checked={selectedComponent.style.hasShadow || false}
                  onCheckedChange={(checked) => { handlePropertyChange('hasShadow', checked) }}
                />
              </div>
              {selectedComponent.style.hasShadow && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Intensidad</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[selectedComponent.style.shadowIntensity || 5]}
                        min={1}
                        max={20}
                        step={1}
                        onValueChange={(value) => { handlePropertyChange('shadowIntensity', value[0]) }}
                        className="flex-1"
                      />
                      <span className="text-xs w-6 text-center">
                        {selectedComponent.style.shadowIntensity || 5}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="layout" className="py-4 space-y-4 m-0">
            {/* Dimensions */}
            <div>
              <h4 className="text-sm font-medium mb-2">Dimensiones</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="width" className="text-xs">Ancho</Label>
                  <div className="flex items-center">
                    <Input
                      id="width"
                      type="number"
                      value={selectedComponent.style.width || ''}
                      onChange={(e) => { handlePropertyChange('width', e.target.value) }}
                      className="h-8"
                    />
                    <Select
                      value={selectedComponent.style.widthUnit || 'px'}
                      onValueChange={(value) => { handlePropertyChange('widthUnit', value) }}
                    >
                      <SelectTrigger className="w-16 h-8 ml-2">
                        <SelectValue placeholder="px" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="px">px</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                        {/* <SelectItem value="rem">rem</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="height" className="text-xs">Alto</Label>
                  <div className="flex items-center">
                    <Input
                      id="height"
                      type="number"
                      value={selectedComponent.style.height || ''}
                      onChange={(e) => { handlePropertyChange('height', e.target.value) }}
                      className="h-8"
                    />
                    <Select
                      value={selectedComponent.style.heightUnit || 'px'}
                      onValueChange={(value) => { handlePropertyChange('heightUnit', value) }}
                    >
                      <SelectTrigger className="w-16 h-8 ml-2">
                        <SelectValue placeholder="px" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="px">px</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                        {/* <SelectItem value="rem">rem</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacing */}
            <div>
              <h4 className="text-sm font-medium mb-2">Espaciado</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="margin" className="text-xs">Margen</Label>
                    <Input
                      id="margin"
                      value={selectedComponent.style.margin || ''}
                      onChange={(e) => { handlePropertyChange('margin', e.target.value) }}
                      className="h-8"
                      placeholder="0 0 0 0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="padding" className="text-xs">Padding</Label>
                    <Input
                      id="padding"
                      value={selectedComponent.style.padding || ''}
                      onChange={(e) => { handlePropertyChange('padding', e.target.value) }}
                      className="h-8"
                      placeholder="0 0 0 0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Position */}
            <div>
              <h4 className="text-sm font-medium mb-2">Posición</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="position-type" className="text-xs">Tipo</Label>
                  <Select
                    value={selectedComponent.style.position || 'static'}
                    onValueChange={(value) => { handlePropertyChange('position', value) }}
                  >
                    <SelectTrigger id="position-type" className="h-8">
                      <SelectValue placeholder="Tipo de posición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="static">Static</SelectItem>
                      <SelectItem value="relative">Relative</SelectItem>
                      <SelectItem value="absolute">Absolute</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="text" className="py-4 space-y-4 m-0">
            <div className="space-y-1">
              <Label htmlFor="content-text" className="text-xs">Contenido</Label>
              <Input
                id="content-text"
                value={selectedComponent.style.text || ''}
                onChange={(e) => { handlePropertyChange('text', e.target.value) }}
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="font-family" className="text-xs">Fuente</Label>
              <Select
                value={selectedComponent.style.fontFamily || 'sans-serif'}
                onValueChange={(value) => { handlePropertyChange('fontFamily', value) }}
              >
                <SelectTrigger id="font-family" className="h-8">
                  <SelectValue placeholder="Sans-serif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans-serif">Sans-serif</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="monospace">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Tamaño</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[selectedComponent.style.fontSize || 16]}
                    min={8}
                    max={72}
                    step={1}
                    onValueChange={(value) => { handlePropertyChange('fontSize', value[0]) }}
                    className="flex-1"
                  />
                  <span className="text-xs w-6 text-center">
                    {selectedComponent.style.fontSize || 16}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Peso</Label>
                <Select
                  value={selectedComponent.style.fontWeight || 'normal'}
                  onValueChange={(value) => { handlePropertyChange('fontWeight', value) }}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Normal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Alineación</h4>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  type="button"
                  variant={selectedComponent.style.textAlign === 'left' ? 'default' : 'ghost'}
                  className="flex-1 rounded-none h-8"
                  onClick={() => { handlePropertyChange('textAlign', 'left') }}
                >
                  Izq.
                </Button>
                <Button
                  type="button"
                  variant={selectedComponent.style.textAlign === 'center' ? 'default' : 'ghost'}
                  className="flex-1 rounded-none h-8"
                  onClick={() => { handlePropertyChange('textAlign', 'center') }}
                >
                  Centro
                </Button>
                <Button
                  type="button"
                  variant={selectedComponent.style.textAlign === 'right' ? 'default' : 'ghost'}
                  className="flex-1 rounded-none h-8"
                  onClick={() => { handlePropertyChange('textAlign', 'right') }}
                >
                  Der.
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="py-4 m-0">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="click-action" className="text-xs">Acción al hacer clic</Label>
                <Select
                  value={selectedComponent.style.clickAction || 'none'}
                  onValueChange={(value) => { handlePropertyChange('clickAction', value) }}
                >
                  <SelectTrigger id="click-action" className="h-8">
                    <SelectValue placeholder="Ninguna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguna</SelectItem>
                    <SelectItem value="navigate">Navegar a</SelectItem>
                    <SelectItem value="openModal">Abrir modal</SelectItem>
                    <SelectItem value="submitForm">Enviar formulario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedComponent.style.clickAction === 'navigate' && (
                <div className="space-y-1">
                  <Label htmlFor="navigate-url" className="text-xs">URL de destino</Label>
                  <Input
                    id="navigate-url"
                    value={selectedComponent.style.navigateUrl || ''}
                    onChange={(e) => { handlePropertyChange('navigateUrl', e.target.value) }}
                    className="h-8"
                    placeholder="https://example.com"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="py-4 m-0">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="custom-class" className="text-xs">Clases CSS</Label>
                <Input
                  id="custom-class"
                  value={selectedComponent.style.customClass || ''}
                  onChange={(e) => { handlePropertyChange('customClass', e.target.value) }}
                  className="h-8"
                  placeholder="class1 class2"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="custom-id" className="text-xs">ID del elemento</Label>
                <Input
                  id="custom-id"
                  value={selectedComponent.style.customId || ''}
                  onChange={(e) => { handlePropertyChange('customId', e.target.value) }}
                  className="h-8"
                  placeholder="element-id"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="custom-styles" className="text-xs">Estilos personalizados</Label>
                <textarea
                  id="custom-styles"
                  value={selectedComponent.style.customStyles || ''}
                  onChange={(e) => { handlePropertyChange('customStyles', e.target.value) }}
                  className="w-full h-24 text-xs p-2 rounded-md border resize-none"
                  placeholder="color: red; background: blue;"
                ></textarea>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
