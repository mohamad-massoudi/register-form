"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useStudents } from "../store/studentstore"
import { toast } from "sonner"

export default function RegisterPage() {

  const [step, setStep] = useState(1)
  const [error, setError] = useState("")


  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    grade: "",
    lastSchool: "",
    homeAddress: "",
    studentPhone: "",
    gender: "",
    motherWork: "",
    motherPhone: "",
    fatherWork: "",
    fatherPhone: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
const handleSubmit = async () => {
  setError(""); 


  if (!formData.fullName || !formData.nationalId) {
    setError("نام و نام خانوادگی و کد ملی الزامی هستند");
    return;
  }

  try {
    const response = await fetch("/api/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "خطا در ثبت اطلاعات");
      return;
    }

    toast.success("ثبت نام با موفقیت انجام شد")
    
    setFormData({
      fullName: "",
      nationalId: "",
      grade: "",
      lastSchool: "",
      homeAddress: "",
      studentPhone: "",
      gender: "",
      motherWork: "",
      motherPhone: "",
      fatherWork: "",
      fatherPhone: "",
    });
    setStep(1); // برگشت به مرحله اول
  } catch (err) {
    console.error(err);
    setError("مشکل در ارتباط با سرور");
  }
};

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const inputStyle = `
  w-full px-4 py-3 rounded-xl
  bg-white/70 dark:bg-slate-800/70
  backdrop-blur-md
  border border-slate-200 dark:border-slate-700
  shadow-md
  transition-all duration-300
  focus:outline-none
  focus:ring-2 focus:ring-indigo-500
  hover:shadow-xl
  hover:border-indigo-400
  `

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-indigo-200 via-blue-200 to-purple-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl rounded-3xl shadow-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-10 border border-white/20"
      >

        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          فرم ثبت‌ نام دانش‌آموز
        </h1>

        {/* progress */}
        <div className="flex gap-3 mb-10">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full ${step >= s ? "bg-indigo-500" : "bg-gray-300"}`}
            />
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <input name="fullName" placeholder="نام و نام خانوادگی" className={inputStyle} onChange={handleChange} />
            <input name="nationalId" placeholder="کد ملی" className={inputStyle} onChange={handleChange} />
            <input name="grade" placeholder="پایه تحصیلی" className={inputStyle} onChange={handleChange} />
            <input name="lastSchool" placeholder="مدرسه سال قبل" className={inputStyle} onChange={handleChange} />

            <textarea
              name="homeAddress"
              placeholder="محل سکونت"
              className={inputStyle + " md:col-span-2 min-h-25"}
              onChange={handleChange}
            />
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <input name="studentPhone" placeholder="شماره شاد" className={inputStyle} onChange={handleChange} />

            <div className="flex gap-8 items-center">
              <label>
                <input type="radio" name="gender" value="male" onChange={handleChange} /> پسر
              </label>

              <label>
                <input type="radio" name="gender" value="female" onChange={handleChange} /> دختر
              </label>
            </div>
          </motion.div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <input name="motherWork" placeholder="محل کار مادر" className={inputStyle} onChange={handleChange} />
            <input name="motherPhone" placeholder="شماره مادر" className={inputStyle} onChange={handleChange} />
            <input name="fatherWork" placeholder="محل کار پدر" className={inputStyle} onChange={handleChange} />
            <input name="fatherPhone" placeholder="شماره پدر" className={inputStyle} onChange={handleChange} />
          </motion.div>
        )}

        {/* buttons */}
        <div className="flex justify-between mt-10">
          {step > 1 && (
            <button onClick={prevStep} className="px-6 py-3 rounded-xl bg-red-700 text-white">
              قبلی
            </button>
          )}

          {step < 3 && (
            <button
              onClick={nextStep}
              className="ml-auto px-8 py-3 rounded-xl text-white bg-indigo-600"
            >
              مرحله بعد
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleSubmit}
              className="ml-auto px-8 py-3 rounded-xl text-white bg-green-600"
            >
              ثبت نهایی
            </button>
          )}
        </div>

      </motion.div>
    </div>
  )
}
