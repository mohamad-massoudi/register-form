"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function RegisterPage() {

  const [step, setStep] = useState(1)
  const [error, setError] = useState("")

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const inputStyle = `
  w-full px-4 py-3 rounded-xl
  bg-white/70 dark:bg-slate-800/70
  backdrop-blur-md
  border border-slate-200 dark:border-slate-700
  shadow-md
  transition-all duration-300
  focus:outline-none
  focus:ring-2 focus:ring-indigo-500
  focus:border-indigo-500
  hover:shadow-xl
  hover:border-indigo-400
  `

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-200 via-blue-200 to-purple-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl rounded-3xl shadow-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-10 border border-white/20"
      >

        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          فرم ثبت‌نام دانش‌آموز
        </h1>

        {/* progress */}
        <div className="flex gap-3 mb-10">
          {[1,2,3].map((s)=>(
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition ${
                step >= s ? "bg-indigo-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <motion.div
            initial={{ x: 60, opacity:0 }}
            animate={{ x:0, opacity:1 }}
            className="grid md:grid-cols-2 gap-6"
          >

            <div>
              <label className="font-semibold mb-2 block">نام و نام خانوادگی</label>
              <input className={inputStyle} />
            </div>

            <div>
              <label className="font-semibold mb-2 block">کد ملی</label>
              <input className={inputStyle} />
            </div>

            <div>
              <label className="font-semibold mb-2 block">پایه تحصیلی</label>
              <input className={inputStyle} />
            </div>

            <div>
              <label className="font-semibold mb-2 block">مدرسه سال قبل</label>
              <input className={inputStyle} />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold mb-2 block">محل سکونت</label>
              <textarea className={inputStyle + " min-h-[100px]"} />
            </div>

          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div
            initial={{ x:60, opacity:0 }}
            animate={{ x:0, opacity:1 }}
            className="grid md:grid-cols-2 gap-6"
          >

            <div>
              <label className="font-semibold mb-2 block">شماره شاد دانش‌آموز</label>
              <input className={inputStyle}/>
            </div>

            <div>
              <label className="font-semibold mb-2 block">جنسیت</label>
              <div className="flex gap-8 mt-3">

                <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                  <input type="radio" name="gender"/>
                  پسر
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                  <input type="radio" name="gender"/>
                  دختر
                </label>

              </div>
            </div>

          </motion.div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <motion.div
            initial={{ x:60, opacity:0 }}
            animate={{ x:0, opacity:1 }}
            className="grid md:grid-cols-2 gap-6"
          >

            <div>
              <label className="font-semibold mb-2 block">محل کار مادر</label>
              <input className={inputStyle}/>
            </div>

            <div>
              <label className="font-semibold mb-2 block">شماره مادر</label>
              <input className={inputStyle}/>
            </div>

            <div>
              <label className="font-semibold mb-2 block">محل کار پدر</label>
              <input className={inputStyle}/>
            </div>

            <div>
              <label className="font-semibold mb-2 block">شماره پدر</label>
              <input className={inputStyle}/>
            </div>

          </motion.div>
        )}

        {/* error */}
        {error && (
          <motion.p
            initial={{x:-10}}
            animate={{x:[-10,10,-10]}}
            className="text-red-500 mt-4"
          >
            {error}
          </motion.p>
        )}

        {/* buttons */}
        <div className="flex justify-between mt-10">

          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-3 rounded-xl bg-red-700 hover:bg-red-800 transition"
            >
              قبلی
            </button>
          )}

          {step < 3 && (
            <button
              onClick={nextStep}
              className="ml-auto px-8 py-3 rounded-xl text-white
              bg-gradient-to-r from-indigo-600 to-blue-500
              hover:from-indigo-700 hover:to-blue-600
              shadow-lg hover:shadow-xl transition"
            >
              مرحله بعد
            </button>
          )}

          {step === 3 && (
            <button
              className="ml-auto px-8 py-3 rounded-xl text-white
              bg-gradient-to-r from-green-500 to-emerald-600
              hover:from-green-600 hover:to-emerald-700
              shadow-xl transition"
            >
              ثبت نهایی
            </button>
          )}

        </div>

      </motion.div>
    </div>
  )
}
