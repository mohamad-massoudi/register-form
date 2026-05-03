/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { axiosClient } from "@/config/axiosClient";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface IStudent {
  _id: string;
  fullName: string;
  nationalId: string;
  level: string;
  field_study?: string;
  grade: string;
  lastSchool: string;
  homeAddress?: string;
  studentPhone?: string;
  gender: "male" | "female";
  motherWork?: string;
  motherPhone?: string;
  fatherWork?: string;
  fatherPhone?: string;
  createdAt: string;
  updatedAt: string;
  fatherName?: string;
  motherName?: string;
  birthday?: string;
  grade_point?: string;
  has_academic_guidance?: string;
  academic_guidance_a?: string;
  academic_guidance_b?: string;
  registerCode?: string;
  
}

const GUIDANCE_OPTIONS = ["تجربی", "ریاضی", "انسانی", "فنی و حرفه‌ای"];

const levels = [
  { label: "پیش‌ دبستانی", value: "preschool" },
  { label: "دبستان", value: "primary" },
  { label: "متوسطه اول", value: "middle" },
  { label: "متوسطه دوم", value: "high" },
  { label: "هنرستان", value: "technical" },
];

const gradeOptions: Record<string, { value: string; label: string }[]> = {
  preschool: [{ value: "pre", label: "پیش‌دبستانی" }],
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
};

const grades = [
  { label: "پیش‌دبستانی", value: "pre" },
  { label: "پایه اول", value: "1" },
  { label: "پایه دوم", value: "2" },
  { label: "پایه سوم", value: "3" },
  { label: "پایه چهارم", value: "4" },
  { label: "پایه پنجم", value: "5" },
  { label: "پایه ششم", value: "6" },
  { label: "پایه هفتم", value: "7" },
  { label: "پایه هشتم", value: "8" },
  { label: "پایه نهم", value: "9" },
  { label: "پایه دهم", value: "10" },
  { label: "پایه یازدهم", value: "11" },
  { label: "پایه دوازدهم", value: "12" },
];

const levelMap: Record<string, string> = {
  preschool: "پیش‌دبستانی",
  primary: "دبستان",
  middle: "متوسطه اول",
  high: "متوسطه دوم",
  technical: "هنرستان",
};

const emptyForm: Omit<IStudent, "_id" | "createdAt" | "updatedAt"> = {
  fullName: "",
  nationalId: "",
  grade: "",
  lastSchool: "",
  homeAddress: "",
  studentPhone: "",
  gender: "male",
  motherWork: "",
  motherPhone: "",
  fatherWork: "",
  fatherPhone: "",
  level: "",
  field_study: "",
  fatherName: "",
  motherName: "",
  birthday: "",
  grade_point: "",
  has_academic_guidance: "",
  academic_guidance_a: "",
  academic_guidance_b: "",
};

type ModalMode = "add" | "edit" | "view" | null;

export default function AdminPage() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [filterLevel, setFilterLevel] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterGrade) params.set("grade", filterGrade);
      if (filterGender) params.set("gender", filterGender);
      if (filterLevel) params.set("level", filterLevel);
      const res = await axiosClient.get(`/student?${params.toString()}`);
      if (!res.data) throw new Error();
      setStudents(res.data);
    } catch {
      showToast("خطا در دریافت اطلاعات", "error");
    } finally {
      setLoading(false);
    }
  }, [filterGrade, filterGender, filterLevel]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const openAdd = () => {
    setForm(emptyForm);
    setSelectedStudent(null);
    setModalMode("add");
  };

  const openEdit = (student: IStudent) => {
    setSelectedStudent(student);
    setForm({
      fullName: student.fullName,
      nationalId: student.nationalId,
      grade: student.grade ?? "",
      lastSchool: student.lastSchool ?? "",
      homeAddress: student.homeAddress ?? "",
      studentPhone: student.studentPhone ?? "",
      gender: student.gender,
      motherWork: student.motherWork ?? "",
      motherPhone: student.motherPhone ?? "",
      fatherWork: student.fatherWork ?? "",
      fatherPhone: student.fatherPhone ?? "",
      level: student.level ?? "",
      field_study: student.field_study ?? "",
      fatherName: student.fatherName ?? "",
      motherName: student.motherName ?? "",
      birthday: student.birthday ?? "",
      grade_point: student.grade_point ?? "",
      has_academic_guidance: student.has_academic_guidance ?? "",
      academic_guidance_a: student.academic_guidance_a ?? "",
      academic_guidance_b: student.academic_guidance_b ?? "",
    });
    setModalMode("edit");
  };

  const openView = (student: IStudent) => {
    setSelectedStudent(student);
    setModalMode("view");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedStudent(null);
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim() || !form.nationalId.trim()) {
      showToast("نام کامل و کد ملی الزامی هستند", "error");
      return;
    }
    setActionLoading(true);
    try {
      if (modalMode === "add") {
        const res = await axiosClient.post("/student", form);
        if (!res.data) throw new Error(res.data?.message);
        showToast("دانش‌آموز با موفقیت ثبت شد", "success");
      } else if (modalMode === "edit" && selectedStudent) {
        const res = await axiosClient.put(`/student/${selectedStudent._id}`, form);
        if (!res.data) throw new Error(res.data?.message);
        showToast("اطلاعات با موفقیت بروزرسانی شد", "success");
      }
      closeModal();
      fetchStudents();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "خطایی رخ داد", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await axiosClient.delete(`/student/${id}`);
      if (!res.data) throw new Error(res.data?.message);
      showToast("دانش‌آموز با موفقیت حذف شد", "success");
      setDeleteConfirm(null);
      fetchStudents();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "خطا در حذف", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredStudents = students.filter((s) =>
    search.trim()
      ? s.fullName.includes(search) || s.nationalId.includes(search) || s.registerCode?.includes(search)
      : true
  )

  const exportToExcel = () => {
    const data = filteredStudents.map((s, i) => ({
      "#": i + 1,
      "نام کامل": s.fullName,
      "کد ملی": s.nationalId,
      "جنسیت": s.gender === "male" ? "پسر" : s.gender === "female" ? "دختر" : "-",
      "مقطع": levelMap[s.level] || "-",
      "پایه": grades.find((g) => g.value === s.grade)?.label || s.grade || "-",
      "رشته": s.field_study || "-",
      "شماره شاد": s.studentPhone || "-",
      "مدرسه قبلی": s.lastSchool || "-",
      "آدرس": s.homeAddress || "-",
      "نام پدر": s.fatherName || "-",
      "شماره پدر": s.fatherPhone || "-",
      "محل کار پدر": s.fatherWork || "-",
      "نام مادر": s.motherName || "-",
      "شماره مادر": s.motherPhone || "-",
      "محل کار مادر": s.motherWork || "-",
      "تاریخ تولد": s.birthday || "-",
      "معدل پایه نهم": s.grade_point || "-",
      "هدایت تحصیلی": s.has_academic_guidance === "yes" ? "دارد" : s.has_academic_guidance === "no" ? "ندارد" : "-",
      "هدایت تحصیلی (الف)": s.has_academic_guidance === "yes" ? (s.academic_guidance_a || "-") : "-",
      "هدایت تحصیلی (ب)": s.has_academic_guidance === "yes" ? (s.academic_guidance_b || "-") : "-",
      "کد پیگیری": s.registerCode || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "students.xlsx");
  };

  const inputCls =
    "w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all";
  const labelCls = "block text-xs font-medium text-zinc-600 mb-1.5 tracking-wide";

  const backdropMotion = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalMotion = {
    hidden: { opacity: 0, y: 18, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 24 } },
    exit: { opacity: 0, y: 12, scale: 0.96, transition: { duration: 0.18, ease: "easeInOut" } },
  };

  const toastMotion = {
    hidden: { opacity: 0, y: -16, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -16, scale: 0.96 },
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900" dir="rtl">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#0f172a 1px,transparent 1px),linear-gradient(90deg,#0f172a 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-200 h-75 rounded-full bg-indigo-100 blur-[100px] pointer-events-none" />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            variants={toastMotion}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-medium shadow-xl shadow-zinc-200/70 ${
              toast.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {toast.type === "success" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/15">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">پنل مدیریت درخواست‌ها</h1>
            </div>
            <p className="text-sm text-zinc-500 mr-12">{students.length} درخواست داده</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/15 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              افزودن دانش‌آموز
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-500/15 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 8l-3-3m3 3l3-3M4 20h16" />
              </svg>
              خروجی Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 mb-6 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-45">
            <label className={labelCls}>جستجو</label>
            <div className="relative">
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="نام یا کد ملی یا کد پیگیری..."
                className={inputCls + " pr-9"}
              />
            </div>
          </div>
          <div className="min-w-35">
            <label className={labelCls}>مقطع</label>
            <select
              title="filter-level"
              value={filterLevel}
              onChange={(e) => { setFilterLevel(e.target.value); setFilterGrade(""); }}
              className={inputCls + " cursor-pointer"}
            >
              <option value="">همه مقاطع</option>
              {levels.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div className="min-w-35">
            <label className={labelCls}>پایه</label>
            <select
              title="filter-grade"
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className={inputCls + " cursor-pointer"}
            >
              <option value="">همه پایه‌ها</option>
              {(filterLevel && gradeOptions[filterLevel]
                ? gradeOptions[filterLevel]
                : grades
              ).map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div className="min-w-35">
            <label className={labelCls}>جنسیت</label>
            <select
              title="filter-gender"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className={inputCls + " cursor-pointer"}
            >
              <option value="">همه</option>
              <option value="male">پسر</option>
              <option value="female">دختر</option>
            </select>
          </div>
          {(filterGrade || filterLevel || filterGender || search) && (
            <button
              onClick={() => { setFilterGrade(""); setFilterLevel(""); setFilterGender(""); setSearch(""); }}
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300 px-3 py-2.5 rounded-xl transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              پاک کردن فیلترها
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "کل دانش‌آموزان", value: students.length, color: "text-indigo-400" },
            { label: "پسران", value: students.filter((s) => s.gender === "male").length, color: "text-blue-400" },
            { label: "دختران", value: students.filter((s) => s.gender === "female").length, color: "text-pink-400" },
            { label: "نتایج فیلتر", value: filteredStudents.length, color: "text-emerald-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-zinc-200 rounded-xl px-4 py-3">
              <p className="text-xs text-zinc-500 mb-0.5">{stat.label}</p>
              <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-zinc-500">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              در حال بارگذاری...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600 gap-3">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">هیچ دانش‌آموزی یافت نشد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200">
                    {[
                      "#", "نام کامل", "کد ملی", "مقطع", "پایه", "رشته",
                      "جنسیت", "شماره تماس", "نام پدر", "تاریخ تولد",
                      "معدل نهم", "هدایت تحصیلی", "هدایت الف", "هدایت ب",
                      "کد پیگیری", "تاریخ ثبت", "عملیات",
                    ].map((h) => (
                      <th key={h} className="text-right text-xs font-medium text-zinc-500 px-5 py-3.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, i) => {
                    const gradeLabel = grades.find((g) => g.value === student.grade)?.label || student.grade;
                    return (
                      <tr key={student._id} className="border-b border-zinc-200 hover:bg-zinc-50 transition-colors">
                        <td className="px-5 py-4 text-zinc-600 text-xs">{i + 1}</td>
                        <td className="px-5 py-4 font-medium text-zinc-900 whitespace-nowrap">{student.fullName}</td>
                        <td className="px-5 py-4 text-zinc-600 font-mono text-xs">{student.nationalId}</td>
                        <td className="px-5 py-4">
                          {student.level ? (
                            <span className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs border border-violet-100 whitespace-nowrap">
                              {levelMap[student.level] || student.level}
                            </span>
                          ) : <span className="text-zinc-400">—</span>}
                        </td>
                        <td className="px-5 py-4">
                          {student.grade ? (
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs border border-indigo-100 whitespace-nowrap">
                              {gradeLabel}
                            </span>
                          ) : <span className="text-zinc-400">—</span>}
                        </td>
                        <td className="px-5 py-4 text-zinc-600 text-xs">{student.field_study || "—"}</td>
                        <td className="px-5 py-4">
                          {student.gender ? (
                            <span className={`px-2.5 py-1 rounded-lg text-xs border whitespace-nowrap ${student.gender === "male" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-pink-50 text-pink-700 border-pink-100"}`}>
                              {student.gender === "male" ? "پسر" : "دختر"}
                            </span>
                          ) : <span className="text-zinc-400">—</span>}
                        </td>
                        <td className="px-5 py-4 text-zinc-600 font-mono text-xs">{student.studentPhone || "—"}</td>
                        <td className="px-5 py-4 text-zinc-600 text-xs whitespace-nowrap">{student.fatherName || "—"}</td>
                        <td className="px-5 py-4 text-zinc-600 text-xs font-mono whitespace-nowrap">{student.birthday || "—"}</td>
                        <td className="px-5 py-4 text-zinc-600 text-xs">{student.grade_point || "—"}</td>
                        <td className="px-5 py-4 text-xs">
                          {student.has_academic_guidance === "yes" ? (
                            <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-100 text-[10px]">دارد</span>
                          ) : student.has_academic_guidance === "no" ? (
                            <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500 border border-zinc-200 text-[10px]">ندارد</span>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-4 text-xs">
                          {student.has_academic_guidance === "yes" && student.academic_guidance_a ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100 text-[10px]">
                              {student.academic_guidance_a}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-4 text-xs">
                          {student.has_academic_guidance === "yes" && student.academic_guidance_b ? (
                            <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100 text-[10px]">
                              {student.academic_guidance_b}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-4 text-zinc-500 text-xs ">
                          {student.registerCode ? (
                            <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200 text-[10px] tracking-wider">
                              {student.registerCode}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-4 text-zinc-500 text-xs ">
                          {student.createdAt ? new Date(student.createdAt).toLocaleDateString("fa-IR",{
                            hour:"numeric",
                            minute:"numeric",
                          }) : "—"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openView(student)} title="مشاهده" className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-all">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                            <button onClick={() => openEdit(student)} title="ویرایش" className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-700 hover:bg-indigo-50 transition-all">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                              </svg>
                            </button>
                            <button onClick={() => setDeleteConfirm(student._id)} title="حذف" className="p-1.5 rounded-lg text-zinc-500 hover:text-red-700 hover:bg-red-50 transition-all">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence mode="wait">
        {(modalMode === "add" || modalMode === "edit") && (
          <motion.div
            key="add-edit-modal"
            variants={backdropMotion}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              variants={modalMotion as any}
              className="bg-white border border-zinc-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl shadow-zinc-200/70"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
                <h2 className="font-semibold text-zinc-900">
                  {modalMode === "add" ? "افزودن دانش‌آموز جدید" : "ویرایش اطلاعات"}
                </h2>
                <button title="close-modal" onClick={closeModal} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* نام و کد ملی */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>نام کامل <span className="text-red-400">*</span></label>
                    <input className={inputCls} value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} placeholder="علی محمدی" />
                  </div>
                  <div>
                    <label className={labelCls}>کد ملی <span className="text-red-400">*</span></label>
                    <input className={inputCls} value={form.nationalId} type="number" maxLength={10} onChange={(e) => setForm((f) => ({ ...f, nationalId: e.target.value }))} placeholder="0012345678" dir="ltr" />
                  </div>
                </div>

                {/* مقطع و پایه */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>مقطع تحصیلی</label>
                    <select
                      title="choose-level"
                      className={inputCls + " cursor-pointer"}
                      value={form.level ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm((f) => ({
                          ...f,
                          level: value,
                          grade: value === "preschool" ? "pre" : "",
                        }));
                      }}
                    >
                      <option value="">انتخاب کنید</option>
                      {levels.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>

                  {/* پایه — فقط یک بار، و فقط وقتی preschool نیست */}
                  {form.level && form.level !== "preschool" && (
                    <div>
                      <label className={labelCls}>پایه</label>
                      <select
                        title="choose-grade"
                        className={inputCls + " cursor-pointer"}
                        value={form.grade}
                        onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
                      >
                        <option value="">انتخاب کنید</option>
                        {(gradeOptions[form.level] || []).map((g) => (
                          <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* رشته تحصیلی */}
                {["10", "11", "12"].includes(form.grade ?? "") && (
                  <div>
                    <label className={labelCls}>رشته تحصیلی</label>
                    <input
                      className={inputCls}
                      value={form.field_study ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, field_study: e.target.value }))}
                      placeholder="ریاضی / تجربی ..."
                    />
                  </div>
                )}

                {/* جنسیت */}
                <div>
                  <label className={labelCls}>جنسیت</label>
                  <select title="choose-gender" className={inputCls + " cursor-pointer"} value={form.gender ?? ""} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as "male" | "female" }))}>
                    <option value="">انتخاب کنید</option>
                    <option value="male">پسر</option>
                    <option value="female">دختر</option>
                  </select>
                </div>

                {/* مدرسه و شماره */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {form.level !== "preschool" && (
                    <div>
                      <label className={labelCls}>مدرسه قبلی</label>
                      <input className={inputCls} value={form.lastSchool} onChange={(e) => setForm((f) => ({ ...f, lastSchool: e.target.value }))} placeholder="مدرسه شهید بهشتی" />
                    </div>
                  )}
                  <div>
                    <label className={labelCls}>شماره شاد دانش‌آموز</label>
                    <input className={inputCls} value={form.studentPhone} type="number" onChange={(e) => setForm((f) => ({ ...f, studentPhone: e.target.value }))} placeholder="09xxxxxxxxx" dir="ltr" />
                  </div>
                </div>

                {/* آدرس */}
                <div>
                  <label className={labelCls}>آدرس منزل</label>
                  <input className={inputCls} value={form.homeAddress} onChange={(e) => setForm((f) => ({ ...f, homeAddress: e.target.value }))} placeholder="تهران، خیابان..." />
                </div>

                {/* اطلاعات تکمیلی پایه دهم */}
                {form.grade === "10" && (
                  <div className="border-t border-zinc-200 pt-4">
                    <p className="text-xs text-zinc-500 mb-3 font-medium">اطلاعات مخصوص پایه دهم</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>نام پدر</label>
                        <input className={inputCls} placeholder="نام پدر" value={form.fatherName} onChange={(e) => setForm((f) => ({ ...f, fatherName: e.target.value }))} />
                      </div>
                      <div>
                        <label className={labelCls}>نام مادر</label>
                        <input className={inputCls} placeholder="نام مادر" value={form.motherName} onChange={(e) => setForm((f) => ({ ...f, motherName: e.target.value }))} />
                      </div>

                      {/* تاریخ تولد */}
                      <div className="sm:col-span-2">
                        <label className={labelCls}>تاریخ تولد</label>
                        <div className="grid grid-cols-3 gap-3">
                          <select title="birthdayYear" className={inputCls + " cursor-pointer"}
                            value={form.birthday?.split("/")[0] || ""}
                            onChange={(e) => {
                              const [, month = "", day = ""] = (form.birthday || "").split("/");
                              setForm((f) => ({ ...f, birthday: `${e.target.value}/${month}/${day}` }));
                            }}>
                            <option value="">سال</option>
                            {Array.from({ length: 36 }, (_, i) => 1370 + i).map((year) => <option key={year} value={year}>{year}</option>)}
                          </select>
                          <select title="birthdayMonth" className={inputCls + " cursor-pointer"}
                            value={form.birthday?.split("/")[1] || ""}
                            onChange={(e) => {
                              const [year = "", , day = ""] = (form.birthday || "").split("/");
                              setForm((f) => ({ ...f, birthday: `${year}/${e.target.value}/${day}` }));
                            }}>
                            <option value="">ماه</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <select title="birthdayDay" className={inputCls + " cursor-pointer"}
                            value={form.birthday?.split("/")[2] || ""}
                            onChange={(e) => {
                              const [year = "", month = ""] = (form.birthday || "").split("/");
                              setForm((f) => ({ ...f, birthday: `${year}/${month}/${e.target.value}` }));
                            }}>
                            <option value="">روز</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>معدل پایه نهم</label>
                        <input className={inputCls} placeholder="مثال: 18.50" value={form.grade_point} onChange={(e) => setForm((f) => ({ ...f, grade_point: e.target.value }))} />
                      </div>

                      {/* هدایت تحصیلی */}
                      <div>
                        <label className={labelCls}>هدایت تحصیلی</label>
                        <select
                          title="has_academic_guidance"
                          className={inputCls + " cursor-pointer"}
                          value={form.has_academic_guidance ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setForm((f) => ({
                              ...f,
                              has_academic_guidance: val,
                              academic_guidance_a: val === "no" ? "" : f.academic_guidance_a,
                              academic_guidance_b: val === "no" ? "" : f.academic_guidance_b,
                            }));
                          }}
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="yes">دارم</option>
                          <option value="no">ندارم</option>
                        </select>
                      </div>

                      {form.has_academic_guidance === "yes" && (
                        <>
                          <div>
                            <label className={labelCls}>هدایت تحصیلی (اولویت الف)</label>
                            <select title="academic_guidance_a" className={inputCls + " cursor-pointer"}
                              value={form.academic_guidance_a}
                              onChange={(e) => setForm((f) => ({ ...f, academic_guidance_a: e.target.value }))}>
                              <option value="">انتخاب کنید</option>
                              {GUIDANCE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>هدایت تحصیلی (اولویت ب)</label>
                            <select title="academic_guidance_b" className={inputCls + " cursor-pointer"}
                              value={form.academic_guidance_b}
                              onChange={(e) => setForm((f) => ({ ...f, academic_guidance_b: e.target.value }))}>
                              <option value="">انتخاب کنید</option>
                              {GUIDANCE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* اطلاعات والدین */}
                <div className="border-t border-zinc-200 pt-4">
                  <p className="text-xs text-zinc-500 mb-3 font-medium">اطلاعات والدین</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {form.grade !== "10" && (
                      <>
                        <div>
                          <label className={labelCls}>نام پدر</label>
                          <input className={inputCls} value={form.fatherName} onChange={(e) => setForm((f) => ({ ...f, fatherName: e.target.value }))} placeholder="نام پدر" />
                        </div>
                        <div>
                          <label className={labelCls}>نام مادر</label>
                          <input className={inputCls} value={form.motherName} onChange={(e) => setForm((f) => ({ ...f, motherName: e.target.value }))} placeholder="نام مادر" />
                        </div>
                      </>
                    )}
                    <div>
                      <label className={labelCls}>محل کار مادر</label>
                      <input className={inputCls} value={form.motherWork} onChange={(e) => setForm((f) => ({ ...f, motherWork: e.target.value }))} placeholder="خانه‌دار / معلم ..." />
                    </div>
                    <div>
                      <label className={labelCls}>شماره مادر</label>
                      <input className={inputCls} value={form.motherPhone} onChange={(e) => setForm((f) => ({ ...f, motherPhone: e.target.value }))} placeholder="09xxxxxxxxx" dir="ltr" />
                    </div>
                    <div>
                      <label className={labelCls}>محل کار پدر</label>
                      <input className={inputCls} value={form.fatherWork} onChange={(e) => setForm((f) => ({ ...f, fatherWork: e.target.value }))} placeholder="مهندس / کارمند ..." />
                    </div>
                    <div>
                      <label className={labelCls}>شماره پدر</label>
                      <input className={inputCls} value={form.fatherPhone} onChange={(e) => setForm((f) => ({ ...f, fatherPhone: e.target.value }))} placeholder="09xxxxxxxxx" dir="ltr" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-zinc-200 flex gap-3 justify-end">
                <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-all">
                  انصراف
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white text-sm font-medium transition-all active:scale-95"
                >
                  {actionLoading && (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {modalMode === "add" ? "ثبت دانش‌آموز" : "ذخیره تغییرات"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence mode="wait">
        {modalMode === "view" && selectedStudent && (
          <motion.div
            key="view-modal"
            variants={backdropMotion}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              variants={modalMotion as any}
              className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg shadow-xl shadow-zinc-200/70 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium ${selectedStudent.gender === "female" ? "bg-pink-50 text-pink-700 border border-pink-100" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
                    {selectedStudent.fullName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-semibold text-zinc-900">{selectedStudent.fullName}</h2>
                    <p className="text-xs text-zinc-500">{selectedStudent.nationalId}</p>
                  </div>
                </div>
                <button title="close-modal" onClick={closeModal} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-1">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest pb-1">اطلاعات دانش‌آموز</p>
                {[
                  ["مقطع", levelMap[selectedStudent.level] || selectedStudent.level],
                  ["پایه", grades.find((g) => g.value === selectedStudent.grade)?.label || selectedStudent.grade],
                  ["رشته تحصیلی", selectedStudent.field_study],
                  ["جنسیت", selectedStudent.gender === "male" ? "پسر" : selectedStudent.gender === "female" ? "دختر" : undefined],
                  ["مدرسه قبلی", selectedStudent.lastSchool],
                  ["شماره شاد", selectedStudent.studentPhone],
                  ["آدرس", selectedStudent.homeAddress],
                  ["کد پیگیری", selectedStudent.registerCode],
                ].map(([k, v]) =>
                  v ? (
                    <div key={k as string} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                      <span className="text-xs text-zinc-500">{k}</span>
                      <span className="text-sm text-zinc-800 font-medium">{v}</span>
                    </div>
                  ) : null
                )}

                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest pt-3 pb-1">اطلاعات والدین</p>
                {[
                  ["نام پدر", selectedStudent.fatherName],
                  ["شماره پدر", selectedStudent.fatherPhone],
                  ["محل کار پدر", selectedStudent.fatherWork],
                  ["نام مادر", selectedStudent.motherName],
                  ["شماره مادر", selectedStudent.motherPhone],
                  ["محل کار مادر", selectedStudent.motherWork],
                ].map(([k, v]) =>
                  v ? (
                    <div key={k as string} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                      <span className="text-xs text-zinc-500">{k}</span>
                      <span className="text-sm text-zinc-800 font-medium">{v}</span>
                    </div>
                  ) : null
                )}

                {selectedStudent.grade === "10" && (
                  selectedStudent.birthday || selectedStudent.grade_point || selectedStudent.has_academic_guidance
                ) && (
                  <>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest pt-3 pb-1">اطلاعات تکمیلی پایه دهم</p>
                    {[
                      ["تاریخ تولد", selectedStudent.birthday],
                      ["معدل پایه نهم", selectedStudent.grade_point],
                      ["هدایت تحصیلی", selectedStudent.has_academic_guidance === "yes" ? "دارد" : selectedStudent.has_academic_guidance === "no" ? "ندارد" : undefined],
                      ["هدایت تحصیلی (الف)", selectedStudent.has_academic_guidance === "yes" ? selectedStudent.academic_guidance_a : undefined],
                      ["هدایت تحصیلی (ب)", selectedStudent.has_academic_guidance === "yes" ? selectedStudent.academic_guidance_b : undefined],
                    ].map(([k, v]) =>
                      v ? (
                        <div key={k as string} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                          <span className="text-xs text-zinc-500">{k}</span>
                          <span className="text-sm text-zinc-800 font-medium">{v}</span>
                        </div>
                      ) : null
                    )}
                  </>
                )}
              </div>

              <div className="px-6 py-4 border-t border-zinc-200 flex gap-3 justify-end">
                <button
                  onClick={() => { closeModal(); openEdit(selectedStudent); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-sm transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                  ویرایش
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence mode="wait">
        {deleteConfirm && (
          <motion.div
            key="delete-confirm-modal"
            variants={backdropMotion}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              variants={modalMotion as any}
              className="bg-white border border-zinc-200 rounded-2xl w-full max-w-sm p-6 shadow-xl shadow-zinc-200/70"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-center font-semibold text-zinc-900 mb-2">حذف دانش‌آموز</h3>
              <p className="text-center text-sm text-zinc-600 mb-6">آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-all"
                >
                  انصراف
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-medium transition-all active:scale-95"
                >
                  {actionLoading && (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  بله، حذف کن
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}