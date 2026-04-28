"use client"

import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"
import { useStudents } from "../store/studentstore";


export default function AdminPage() {

    const { students } = useStudents()

    return (
        <div className="min-h-screen p-10 bg-linear-to-br from-purple-200 via-blue-200 to-indigo-200">

            <div className="max-w-6xl mx-auto bg-white p-10 rounded-3xl shadow-xl">

                <h1 className="text-4xl font-bold mb-10 text-center">
                    پنل مدیریت ثبت‌نام‌ها
                </h1>

                {students.length === 0 && (
                    <p className="text-center text-gray-500">
                        هنوز ثبت‌نامی انجام نشده
                    </p>
                )}

                <div className="grid gap-6">

                    {students.map((student: { id: Key | null | undefined; fullName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; nationalId: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; grade: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; lastSchool: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; studentPhone: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; gender: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; motherWork: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; motherPhone: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; fatherWork: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; fatherPhone: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; homeAddress: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (

                        <div
                            key={student.id}
                            className="border rounded-xl p-6 shadow-md"
                        >

                            <h2 className="text-xl font-bold mb-3">
                                {student.fullName}
                            </h2>

                            <div className="grid md:grid-cols-2 gap-2 text-sm">

                                <p>کد ملی: {student.nationalId}</p>
                                <p>پایه: {student.grade}</p>
                                <p>مدرسه قبلی: {student.lastSchool}</p>
                                <p>شماره شاد: {student.studentPhone}</p>
                                <p>جنسیت: {student.gender}</p>

                                <p>محل کار مادر: {student.motherWork}</p>
                                <p>شماره مادر: {student.motherPhone}</p>

                                <p>محل کار پدر: {student.fatherWork}</p>
                                <p>شماره پدر: {student.fatherPhone}</p>

                                <p className="md:col-span-2">
                                    آدرس: {student.homeAddress}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    )
}
