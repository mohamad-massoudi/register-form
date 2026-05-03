/* eslint-disable react-hooks/static-components */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Image from "next/image"


const gradeOptions: Record<string, { value: string; label: string }[]> = {
  preschool: [
    { value: "pre", label: "پیش‌دبستانی" },
  ],
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
  const [successData, setSuccessData] = useState<{ registerCode: string } | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    level: "",
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
    fatherName: "",
    motherName: "",
    birthday: "",
    grade_point: "",
     has_academic_guidance: "",  // اضافه کن
    academic_guidance_a: "",
    academic_guidance_b: "",
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
if (name === "level" && value === "preschool") {
  setFormData(prev => ({
    ...prev,
    level: value,
    grade: "pre",
  }))
  return
}
if (name === "has_academic_guidance" && value === "no") {
  setFormData(prev => ({
    ...prev,
    has_academic_guidance: "no",
    academic_guidance_a: "",
    academic_guidance_b: "",
  }))
  return
}
    // پاک کردن خطای فیلد هنگام تغییر مقدار
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const GUIDANCE_OPTIONS = ["تجربی", "ریاضی", "انسانی", "فنی"];


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

    if (!formData.lastSchool.trim() && formData.level !== "preschool")
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


   if (formData.grade === "10") {
  if (!formData.has_academic_guidance) {
    errors.has_academic_guidance = "لطفاً مشخص کنید هدایت تحصیلی دارید یا نه"
  }

  if (!formData.grade_point.trim()) {
    errors.grade_point = "معدل پایه نهم الزامی است"
  } else if (isNaN(Number(formData.grade_point))) {
    errors.grade_point = "معدل باید عدد باشد"
  }

  if (formData.has_academic_guidance === "yes") {
    if (!formData.academic_guidance_a.trim()) {
      errors.academic_guidance_a = "هدایت تحصیلی اولویت الف الزامی است"
    }
    if (!formData.academic_guidance_b.trim()) {
      errors.academic_guidance_b = "هدایت تحصیلی اولویت ب الزامی است"
    }
  }
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
    if (!formData.fatherName.trim()) errors.fatherName = "نام پدر الزامی است";
    if (!formData.motherName.trim()) errors.motherName = "نام مادر الزامی است";
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

      // ✅ نمایش کد پیگیری به کاربر
      //   if (data.registerCode) {
      //   toast.success(`ثبت نام با موفقیت انجام شد. کد پیگیری شما: ${data.registerCode}`)
      //   alert(`ثبت نام شما با موفقیت انجام شد.\n\nکد پیگیری شما:\n${data.registerCode}`)
      // } else {
      //   toast.success("ثبت نام با موفقیت انجام شد")
      // }
      setSuccessData({ registerCode: data.registerCode || "" })
      toast.success("ثبت نام با موفقیت انجام شد")

      // ریست فرم
      setFormData({
        fullName: "",
        nationalId: "",
        level: "",
        grade: "",
        field_study: "",
        has_academic_guidance: "",
        lastSchool: "",
        homeAddress: "",
        studentPhone: "",
        gender: "",
        motherWork: "",
        motherPhone: "",
        fatherWork: "",
        fatherPhone: "",
        fatherName: "",
        motherName: "",
        birthday: "",
        grade_point: "",
        academic_guidance_a: "",
        academic_guidance_b: "",
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
  if (successData) {
    return (
      <div className="min-h-screen flex flex-col gap-8 items-center justify-center p-6 bg-linear-to-br from-indigo-200 via-blue-200 to-purple-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Image src={"/default-logo.jpg"} alt="Logo" width={150} height={150} className="rounded-full shadow-md shadow-white" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-10 border border-white/20 text-center"
        >
          {/* آیکون تیک */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            ثبت‌نام با موفقیت انجام شد
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            اطلاعات شما با موفقیت ثبت شد. کد پیگیری خود را نگه دارید.
          </p>

          {/* کد پیگیری */}
          {successData.registerCode && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-2xl p-5 mb-8">
              <p className="text-xs text-indigo-500 dark:text-indigo-400 mb-2">کد پیگیری شما</p>
              <p className="text-3xl font-bold tracking-widest text-indigo-700 dark:text-indigo-300 font-mono">
                {successData.registerCode}
              </p>
            </div>
          )}

          <button
            onClick={() => {
              setSuccessData(null)
              setFormData({
                fullName: "",
                nationalId: "",
                level: "",
                grade: "",
                field_study: "",
                lastSchool: "",
                homeAddress: "",
                studentPhone: "",
                gender: "",
                  has_academic_guidance: "",
                motherWork: "",
                motherPhone: "",
                fatherWork: "",
                fatherPhone: "",
                fatherName: "",
                motherName: "",
                birthday: "",
                grade_point: "",
                academic_guidance_a: "",
                academic_guidance_b: "",
              })
              setStep(1)
            }}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all active:scale-95"
          >
            ثبت‌نام جدید
          </button>
        </motion.div>
      </div>
    )
  }
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
                <option value="preschool">پیش‌ دبستانی</option>
                <option value="primary">دبستان</option>
                <option value="middle">متوسطه اول</option>
                <option value="high">متوسطه دوم</option>
                <option value="technical">هنرستان</option>
              </select>
              <FieldError field="level" />
            </div>
            <div>
            {formData.level !== "preschool" && (
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
)}
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
         {formData.grade === "10" && (
  <>
    <div>
      <input
        name="grade_point"
        placeholder="معدل پایه نهم"
        className={getInputStyle("grade_point")}
        value={formData.grade_point}
        onChange={handleChange}
      />
      <FieldError field="grade_point" />
    </div>

    <div>
      <select
        title="has_academic_guidance"
        name="has_academic_guidance"
        className={getInputStyle("has_academic_guidance")}
        value={formData.has_academic_guidance}
        onChange={handleChange}
      >
        <option value="">هدایت تحصیلی دارید؟</option>
        <option value="yes">دارم</option>
        <option value="no">ندارم</option>
      </select>
      <FieldError field="has_academic_guidance" />
    </div>

    {formData.has_academic_guidance === "yes" && (
      <>
        <div>
          <select
            title="academic_guidance_a"
            name="academic_guidance_a"
            className={getInputStyle("academic_guidance_a")}
            value={formData.academic_guidance_a}
            onChange={handleChange}
          >
            <option value="">اولویت الف (انتخاب کنید)</option>
            {GUIDANCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <FieldError field="academic_guidance_a" />
        </div>

        <div>
          <select
            title="academic_guidance_b"
            name="academic_guidance_b"
            className={getInputStyle("academic_guidance_b")}
            value={formData.academic_guidance_b}
            onChange={handleChange}
          >
            <option value="">اولویت ب (انتخاب کنید)</option>
            {GUIDANCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <FieldError field="academic_guidance_b" />
        </div>
      </>
    )}
  </>
)}

        {
          formData.level !== "preschool" && 
            <div>
              <input name="lastSchool" placeholder="مدرسه سال قبل" className={getInputStyle("lastSchool")} value={formData.lastSchool} onChange={handleChange} />
              <FieldError field="lastSchool" />
            </div>
        }

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
            <>
              <div className="md:col-span-2">
                <input
                  name="fatherName"
                  placeholder="نام و نام خانوادگی پدر"
                  className={getInputStyle("fatherName")}
                  value={formData.fatherName}
                  onChange={handleChange}
                />
                <FieldError field="fatherName" />
              </div>

              <div className="md:col-span-2">
                <input
                  name="motherName"
                  placeholder="نام و نام خانوادگی مادر"
                  className={getInputStyle("motherName")}
                  value={formData.motherName}
                  onChange={handleChange}
                />
                <FieldError field="motherName" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-slate-700 dark:text-slate-200">
                  تاریخ تولد
                </label>

                <div className="grid grid-cols-3 gap-3">
                  <select
                    title="birthdayYear"
                    className={getInputStyle("birthday")}
                    value={formData.birthday.split("/")[0] || ""}
                    onChange={(e) => {
                      const [, month = "", day = ""] = formData.birthday.split("/")
                      setFormData(prev => ({
                        ...prev,
                        birthday: `${e.target.value}/${month}/${day}`,
                      }))
                    }}
                  >
                    <option value="">سال</option>
                    {Array.from({ length: 36 }, (_, i) => 1370 + i).map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  <select
                    title="birthdayMonth"
                    className={getInputStyle("birthday")}
                    value={formData.birthday.split("/")[1] || ""}
                    onChange={(e) => {
                      const [year = "", , day = ""] = formData.birthday.split("/")
                      setFormData(prev => ({
                        ...prev,
                        birthday: `${year}/${e.target.value}/${day}`,
                      }))
                    }}
                  >
                    <option value="">ماه</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>

                  <select
                    title="birthdayDay"
                    className={getInputStyle("birthday")}
                    value={formData.birthday.split("/")[2] || ""}
                    onChange={(e) => {
                      const [year = "", month = ""] = formData.birthday.split("/")
                      setFormData(prev => ({
                        ...prev,
                        birthday: `${year}/${month}/${e.target.value}`,
                      }))
                    }}
                  >
                    <option value="">روز</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <FieldError field="birthday" />
              </div>
            </>

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

         {/* Note */}
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 !w-full">
              <strong>نکته:</strong> تکمیل این فرم به معنای ثبت‌نام قطعی نمی‌باشد و پس از بررسی اطلاعات با شما تماس گرفته خواهد شد.
            </div>

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