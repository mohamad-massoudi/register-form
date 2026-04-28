"use client"

import { createContext, useContext, useState } from "react"

type Student = {
    id: number
    fullName: string
    nationalId: string
    grade: string
    lastSchool: string
    homeAddress: string
    studentPhone: string
    gender: string
    motherWork: string
    motherPhone: string
    fatherWork: string
    fatherPhone: string
}

type ContextType = {
    students: Student[]
    addStudent: (student: Omit<Student, "id">) => void
}

const StudentContext = createContext<ContextType | null>(null)

export function StudentProvider({ children }: { children: React.ReactNode }) {
    const [students, setStudents] = useState<Student[]>([])

    const addStudent = (student: Omit<Student, "id">) => {
        setStudents(prev => [
            ...prev,
            { id: Date.now(), ...student }
        ])
    }

    return (
        <StudentContext.Provider value={{ students, addStudent }}>
            {children}
        </StudentContext.Provider>
    )
}

export function useStudents() {
    const context = useContext(StudentContext)
    if (!context) throw new Error("useStudents must be used inside StudentProvider")
    return context
}
