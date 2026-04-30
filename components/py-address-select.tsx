
"use client"

const departments = [
  { name: "Asunción", cities: ["Asunción"] },
  { name: "Central", cities: ["Mariano Roque Alonso", "Lambaré", "Fernando de la Mora", "San Lorenzo", "Luque", "Capiatá", "Itauguá", "Villa Elisa", "Ñemby", "Limpio", "San Antonio", "Areguá", "Guarambaré", "Itá", "Salínpujio", "Ypacaraí", "Ypané"] },
  { name: "Alto Paraná", cities: ["Ciudad del Este", "Presidente Franco", "Hernandarias", "Minga Guazú", "Santa Rita"] },
  { name: "Itapúa", cities: ["Encarnación", "Cambyretá", "Hohenau", "Obligado", "Pirapó", "San Juan del Paraná"] },
  { name: "Caaguazú", cities: ["Coronel Oviedo", "Caaguazú", "Repatriación"] },
  { name: "Paraguarí", cities: ["Paraguarí", "Carapeguá", "Pirayú", "Ybycuí"] },
  { name: "San Pedro", cities: ["San Pedro de Ycuamandiyú", "Santa Rosa del Aguaray"] },
  { name: "Cordillera", cities: ["Caacupé", "Piribebuy", "Tobatí"] },
  { name: "Guairá", cities: ["Villarrica", "Mbocayaty", "Independencia"] },
  { name: "Concepción", cities: ["Concepción", "Horqueta", "Yby Yaú"] },
  { name: "Boquerón", cities: ["Filadelfia", "Loma Plata", "Mariscal Estigarribia"] },
  { name: "Alto Paraguay", cities: ["Fuerte Olimpo", "Bahía Negra"] },
  { name: "Presidente Hayes", cities: ["Villa Hayes", "Nanawa", "Benjamín Aceval"] },
  { name: "Misiones", cities: ["San Juan Bautista", "Ayolas", "San Miguel"] },
  { name: "Neembucú", cities: ["Pilar", "Humaitá", "Alberdi"] },
  { name: "Amambay", cities: ["Pedro Juan Caballero", "Bella Vista", "Capitán Bado"] },
  { name: "Canindeyú", cities: ["Salto del Guairá", "Curuguaty", "Ypejhú"] },
  { name: "Caazapá", cities: ["Caazapá", "Yuty", "San Juan Nepomuceno"] },
]

interface Props { onCityChange: (city: string) => void; onDeptChange?: (dept: string) => void }

export function ParaguayAddressSelect({ onCityChange, onDeptChange }: Props) {
  const handleDept = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDeptChange?.(e.target.value)
    onCityChange("")
  }
  return (
    <div className="grid grid-cols-2 gap-3">
      <select onChange={handleDept} className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring">
        <option value="">Departamento</option>
        {departments.map(d => <option key={d.name}>{d.name}</option>)}
      </select>
      <select onChange={e => onCityChange(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring">
        <option value="">Ciudad</option>
      </select>
    </div>
  )
}
