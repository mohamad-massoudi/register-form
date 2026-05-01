/* eslint-disable react-hooks/static-components */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Image from "next/image"


const gradeOptions: Record<string, { value: string; label: string }[]> = {
  primary: [
    { value: "1", label: "پایه اول" },
    { value: "2", label: "پایه دوم" },
    { value: "3", label: "پایه سوم" },
    { value: "4", label: "پایه چهارم" },
    { value: "5", label: "پایه پنجم" },
    { value: "6", label: "پایه ششم" },
  ],
  middle: [
    { value: "7", label: "پایه هفتم" },
    { value: "8", label: "پایه هشتم" },
    { value: "9", label: "پایه نهم" },
  ],
  high: [
    { value: "10", label: "پایه دهم" },
    { value: "11", label: "پایه یازدهم" },
    { value: "12", label: "پایه دوازدهم" },
  ],
  technical: [
    { value: "10", label: "پایه دهم" },
    { value: "11", label: "پایه یازدهم" },
    { value: "12", label: "پایه دوازدهم" },
  ],
}


export default function RegisterPage() {

  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    level: "",          // 👈 جدید
    grade: "",
    field_study: "",
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // پاک کردن خطای فیلد هنگام تغییر مقدار
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePhone = (phone: string) =>
    /^09\d{9}$/.test(phone)

  const validateNationalId = (id: string) =>
    /^\d{10}$/.test(id)

  const validateStep1 = () => {
    const errors: Record<string, string> = {}

    if (!formData.fullName.trim())
      errors.fullName = "نام و نام خانوادگی الزامی است"

    if (!formData.nationalId)
      errors.nationalId = "کد ملی الزامی است"
    else if (!validateNationalId(formData.nationalId))
      errors.nationalId = "کد ملی باید ۱۰ رقم باشد"

    if (!formData.grade.trim())
      errors.grade = "پایه تحصیلی الزامی است"

    if (!formData.lastSchool.trim())
      errors.lastSchool = "مدرسه سال قبل الزامی است"

    if (!formData.homeAddress.trim())
      errors.homeAddress = "محل سکونت الزامی است"
    if (!formData.level)
      errors.level = "مقطع تحصیلی الزامی است"

    if (!formData.grade)
      errors.grade = "پایه تحصیلی الزامی است"

    if (
      ["10", "11", "12"].includes(formData.grade) &&
      !formData.field_study.trim()
    ) {
      errors.field_study = "رشته تحصیلی الزامی است"
    }
    return errors
  }

  const validateStep2 = () => {
    const errors: Record<string, string> = {}

    if (!formData.studentPhone)
      errors.studentPhone = "شماره شاد الزامی است"
    else if (!validatePhone(formData.studentPhone))
      errors.studentPhone = "شماره باید ۱۱ رقم و با ۰۹ شروع شود"

    if (!formData.gender)
      errors.gender = "جنسیت الزامی است"

    return errors
  }

  const validateStep3 = () => {
    const errors: Record<string, string> = {}
    if (!formData.motherPhone)
      errors.motherPhone = "شماره مادر الزامی است"
    if (!formData.fatherPhone)
      errors.fatherPhone = "شماره پدر الزامی است"
    if (!validatePhone(formData.motherPhone))
      errors.motherPhone = "شماره باید ۱۱ رقم و با ۰۹ شروع شود"

    if (!validatePhone(formData.fatherPhone))
      errors.fatherPhone = "شماره باید ۱۱ رقم و با ۰۹ شروع شود"

    if (!formData.motherWork.trim())
      errors.motherWork = "محل کار مادر الزامی است"
    if (!formData.fatherWork.trim())
      errors.fatherWork = "محل کار پدر الزامی است"
    return errors
  }

  const handleSubmit = async () => {
    setError("")

    const step3Errors = validateStep3()
    if (Object.keys(step3Errors).length > 0) {
      setFieldErrors(step3Errors)
      return
    }

    try {
      const response = await fetch("/api/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "خطا در ثبت اطلاعات")
        return
      }

      toast.success("ثبت نام با موفقیت انجام شد")

      setFormData({
        fullName: "", nationalId: "", level: "", grade: "", field_study: "", lastSchool: "",
        homeAddress: "", studentPhone: "", gender: "", motherWork: "", motherPhone: "", fatherWork: "", fatherPhone: "",
      })
      setStep(1)
    } catch (err) {
      console.error(err)
      setError("مشکل در ارتباط با سرور")
    }
  }

  const nextStep = () => {
    setFieldErrors({})
    if (step === 1) {
      const errors = validateStep1()
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        return
      }
    }
    if (step === 2) {
      const errors = validateStep2()
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        return
      }
    }
    setStep(step + 1)
  }

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

  const errorInputStyle = `
    w-full px-4 py-3 rounded-xl
    bg-white/70 dark:bg-slate-800/70
    backdrop-blur-md
    border border-red-400 dark:border-red-500
    shadow-md
    transition-all duration-300
    focus:outline-none
    focus:ring-2 focus:ring-red-400
    hover:shadow-xl
  `

  const getInputStyle = (field: string) =>
    fieldErrors[field] ? errorInputStyle : inputStyle

  const FieldError = ({ field }: { field: string }) =>
    fieldErrors[field] ? (
      <p className="text-red-500 text-xs mt-1 text-right">{fieldErrors[field]}</p>
    ) : null

  return (
    <div className="min-h-screen flex flex-col gap-8 items-center justify-start p-6 bg-linear-to-br from-indigo-200 via-blue-200 to-purple-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
 
      <Image src={"/default-logo.jpg"} alt="Logo" width={300} height={300} className="rounded-full shadow-md shadow-white" />
   
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
            <div>
              <input name="fullName" placeholder="نام و نام خانوادگی" className={getInputStyle("fullName")} value={formData.fullName} onChange={handleChange} />
              <FieldError field="fullName" />
            </div>

            <div>
              <input
                name="nationalId"
                placeholder="کد ملی"
                className={getInputStyle("nationalId")}
                value={formData.nationalId}
                inputMode="numeric"
                maxLength={10}
                onChange={handleChange}
              />
              <FieldError field="nationalId" />
            </div>
            <div>
              <select
                title="level"
                name="level"
                className={getInputStyle("level")}
                value={formData.level}
                onChange={handleChange}
              >
                <option value="">انتخاب مقطع</option>
                <option value="primary">دبستان</option>
                <option value="middle">متوسطه اول</option>
                <option value="high">متوسطه دوم</option>
                <option value="technical">هنرستان</option>
              </select>
              <FieldError field="level" />
            </div>
            <div>
              <select
                title="grade"
                name="grade"
                className={getInputStyle("grade")}
                value={formData.grade}
                onChange={handleChange}
                disabled={!formData.level}
              >
                <option value="">انتخاب پایه</option>
                {gradeOptions[formData.level]?.map(g => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
              <FieldError field="grade" />
            </div>
            {["10", "11", "12"].includes(formData.grade) && (
              <div>
                <input
                  name="field_study"
                  placeholder="رشته تحصیلی"
                  className={getInputStyle("field_study")}
                  value={formData.field_study}
                  onChange={handleChange}
                />
                <FieldError field="field_study" />
              </div>
            )}
            <div>
              <input name="lastSchool" placeholder="مدرسه سال قبل" className={getInputStyle("lastSchool")} value={formData.lastSchool} onChange={handleChange} />
              <FieldError field="lastSchool" />
            </div>

            <div className="md:col-span-2">
              <textarea
                name="homeAddress"
                placeholder="محل سکونت"
                className={getInputStyle("homeAddress") + " min-h-25"}
                value={formData.homeAddress}
                onChange={handleChange}
              />
              <FieldError field="homeAddress" />
            </div>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div>
              <input
                name="studentPhone"
                placeholder="شماره شاد"
                className={getInputStyle("studentPhone")}
                value={formData.studentPhone}
                inputMode="numeric"
                maxLength={11}
                onChange={handleChange}
              />
              <FieldError field="studentPhone" />
            </div>

            <div>
              <div className="flex gap-8 items-center py-3">
                <label>
                  <input type="radio" name="gender" value="male" onChange={handleChange} checked={formData.gender === "male"} /> پسر
                </label>
                <label>
                  <input type="radio" name="gender" value="female" onChange={handleChange} checked={formData.gender === "female"} /> دختر
                </label>
              </div>
              <FieldError field="gender" />
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
            <div>
              <input name="motherWork" placeholder="محل کار مادر" className={getInputStyle("motherWork")} value={formData.motherWork} onChange={handleChange} />
              <FieldError field="motherWork" />
            </div>

            <div>
              <input
                name="motherPhone"
                placeholder="شماره مادر"
                className={getInputStyle("motherPhone")}
                value={formData.motherPhone}
                inputMode="numeric"
                maxLength={11}
                onChange={handleChange}
              />
              <FieldError field="motherPhone" />
            </div>

            <div>
              <input name="fatherWork" placeholder="محل کار پدر" className={getInputStyle("fatherWork")} value={formData.fatherWork} onChange={handleChange} />
              <FieldError field="fatherWork" />
            </div>

            <div>
              <input
                name="fatherPhone"
                placeholder="شماره پدر"
                className={getInputStyle("fatherPhone")}
                value={formData.fatherPhone}
                inputMode="numeric"
                maxLength={11}
                onChange={handleChange}
              />
              <FieldError field="fatherPhone" />
            </div>
          </motion.div>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        {/* buttons */}
        <div className="flex justify-between mt-10 gap-4">
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