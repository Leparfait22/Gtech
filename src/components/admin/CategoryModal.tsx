'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Cpu, HardDrive, Monitor, Camera, Battery, Gamepad, Smartphone, Settings, MemoryStick } from 'lucide-react'
import { createCategory } from '@/app/actions/categoryActions'

const ICON_LIBRARY = [
  { value: 'Cpu', label: 'Processeur/Puce', icon: Cpu },
  { value: 'MemoryStick', label: 'RAM/Mémoire', icon: MemoryStick },
  { value: 'HardDrive', label: 'Disque/Stockage', icon: HardDrive },
  { value: 'Monitor', label: 'Ecran/Affichage', icon: Monitor },
  { value: 'Camera', label: 'Caméra/Photo', icon: Camera },
  { value: 'Battery', label: 'Batterie/Autonomie', icon: Battery },
  { value: 'Gamepad', label: 'Manette/Jeu', icon: Gamepad },
  { value: 'Smartphone', label: 'Téléphone/Mobile', icon: Smartphone },
  { value: 'Settings', label: 'Générique/Autre', icon: Settings }
]

export function CategoryModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [defaultFeatures, setDefaultFeatures] = useState<{label: string, icon: string}[]>([])

  const addFeature = () => setDefaultFeatures([...defaultFeatures, { label: '', icon: 'Settings' }])
  const removeFeature = (index: number) => setDefaultFeatures(defaultFeatures.filter((_, i) => i !== index))
  const updateFeature = (index: number, key: 'label' | 'icon', val: string) => {
    const newFeatures = [...defaultFeatures]
    newFeatures[index][key] = val
    setDefaultFeatures(newFeatures)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append('default_features', JSON.stringify(defaultFeatures.filter(f => f.label.trim())))
    const result = await createCategory(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setLoading(false)
      setOpen(false) // Close modal on success
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex items-center gap-2 border-dashed">
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Nova Categoria</span>
        <span className="sm:hidden">Categoria</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
          <DialogDescription>
            Adicione uma nova categoria de produtos ao sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: Smartphones"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Ex: Aparelhos celulares e acessórios"
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label>Modèles de caractéristiques (Optionnel)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="w-4 h-4 mr-2" /> Ajouter
                </Button>
              </div>
              
              {defaultFeatures.length === 0 && (
                <p className="text-sm text-muted-foreground italic">Ajoutez des modèles pour pré-remplir la fiche technique des produits de cette catégorie.</p>
              )}

              <div className="space-y-3 max-h-[200px] overflow-y-auto p-1">
                {defaultFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-1">
                      <Input 
                        placeholder="Label (Ex: RAM)" 
                        value={feature.label}
                        onChange={(e) => updateFeature(index, 'label', e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex-[1.5] space-y-1">
                      <Select value={feature.icon} onValueChange={(val) => updateFeature(index, 'icon', val)}>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Icône" />
                        </SelectTrigger>
                        <SelectContent>
                          {ICON_LIBRARY.map(iconObj => {
                            const IconComp = iconObj.icon
                            return (
                              <SelectItem key={iconObj.value} value={iconObj.value}>
                                <div className="flex items-center gap-2">
                                  <IconComp className="w-4 h-4 text-muted-foreground" />
                                  <span>{iconObj.label}</span>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="text-red-500 shrink-0" onClick={() => removeFeature(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            {error && (
              <div className="text-sm text-destructive font-medium p-2 bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Categoria'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
