import { create } from "zustand"
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import type { DraftPatient, Patient } from "../types"
import { v4 as uuidv4 } from 'uuid';

type PatientState = {
  patients: Patient[]
  activeId: Patient["id"]
  addPatient: (data: DraftPatient) => void
  deletePatient: (id: Patient["id"]) => void
  getPatientById: (id: Patient["id"]) => void
  updatePatient: (data: DraftPatient) => void
}

function createPatient(patient: DraftPatient) : Patient {
  return {...patient, id: uuidv4()}
}

export const usePatientStore = create<PatientState>()(
  devtools(
    persist<PatientState>(
      (set) => ({
        patients: [],
        activeId: "",
        addPatient: (data) => {
          const newPatient = createPatient(data)
          set((state) => ({
            patients: [...state.patients, newPatient]
          }))
        },
        deletePatient: (id) => {
          set((state) => ({
            patients: state.patients.filter(p => p.id !== id),
            activeId: ""
          }))
        },
        getPatientById(id) {
          set(() => ({
            activeId: id
          }))
        },
        updatePatient(data) {
          set((state) => ({
            patients: state.patients.map(p => 
              p.id === state.activeId ? { id: state.activeId, ...data } : p
            ),
            activeId: ""
          }))
        },
      }),
      {
        name: "patient-storage",
        // storage: createJSONStorage(()=>sessionStorage),
        storage: createJSONStorage(()=>localStorage),
      }
    )
  )
)