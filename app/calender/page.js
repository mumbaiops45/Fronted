
"use client"

import React, { useState } from "react";

const tasks = [
  { date: "Today", title: "Day 6 Final", client: "Nisha Jewellers", owner: "Divya M", status: "Overdue" },
  { date: "Today", title: "Day 2 Check-in", client: "Ravi Kumar Foods", owner: "Karthik R", status: "Overdue" },
  { date: "Mar 2", title: "Send Proposal", client: "TechStart Solutions", owner: "Karthik R", status: "Today" },
  { date: "Mar 3", title: "Qualify Call", client: "Priya Electronics", owner: "Arjun S", status: "Today" },
  { date: "Mar 4", title: "Day 4 Case Study", client: "Meena's Bakery", owner: "Divya M", status: "Today" },
];

const page = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month)
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} />);
  }

  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(
      <div
        key={i}
        className="p-2 sm:p-4 rounded hover:bg-gray-200 cursor-pointer transition-colors"
      >
        {i}
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans flex flex-col md:flex-row gap-6">
      
      <div className="w-full md:w-2/3 bg-white shadow rounded p-4 sm:p-6 flex flex-col">
  <div className="flex items-center mb-4 sm:mb-6">
    <button onClick={prevMonth} className="p-2 mx-2 rounded bg-gray-100 text-[14px]  sm:text-base cursor-pointer">‹</button>
    <h1 className="text-[14px] font-bold text-gray-800">{monthNames[month]} {year}</h1>
    <button onClick={nextMonth} className="p-2 mx-2 rounded text-[14px] bg-gray-100 sm:text-base cursor-pointer">›</button>
    <div className="flex space-x-2 ml-auto"> 
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        {["Urgent", "Task", "Done", "Follow-up"].map((status) => (
          <span key={status} className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-[10px]">
            ● {status}
          </span>
        ))}
      </div>
    </div>
  </div>

  <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
      <div key={day} className="font-semibold text-xs sm:text-sm">{day}</div>
    ))}
    {calendarDays}
  </div>
  

</div>
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="bg-white shadow rounded p-4 sm:p-6 flex-1 overflow-y-auto max-h-[500px] md:max-h-full">
          <div className="flex justify-between">
 <p className="text-[12px]  font-bold mb-2">Upcoming</p>
          <p className="text-red-800 text-[12px] bg-red-100 font-bold mb-4 p-2 rounded-md">3 overdue</p>
          </div>
          <div className="space-y-4">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className={`flex justify-between items-center p-3  rounded border ${
                  task.status === "Overdue" ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              >
                <div>
                  <p className="text-gray-600 text-[10px]">{task.status}</p>
                  <p className="font-bold text-gray-800 text-[10px] ">{task.client}</p>
                  <p className="text-gray-500 text-[10px] ">{task.title} · {task.owner}</p>
                </div>
                {task.status && (
                  <span
                    className={`px-2 py-1 text-[10px]  rounded ${
                      task.status === "Overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;








// "use client"

// import React, { useState, useEffect, useCallback } from 'react'
// import axios from 'axios'
// import { useRouter } from 'next/navigation'

// const PRIORITY_COLORS = {
//   Urgent:     { dot: '#ef4444', bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
//   Task:       { dot: '#3b82f6', bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
//   Done:       { dot: '#22c55e', bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
//   'Follow-up':{ dot: '#f59e0b', bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
//   Hot:        { dot: '#ef4444', bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
//   Warm:       { dot: '#f59e0b', bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
//   Cool:       { dot: '#3b82f6', bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
// }

// const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
// const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']



// const toYMD = (d) => {
//   const y = d.getFullYear()
//   const m = String(d.getMonth() + 1).padStart(2, '0')
//   const day = String(d.getDate()).padStart(2, '0')
//   return `${y}-${m}-${day}`
// }

// const today = toYMD(new Date())

// const isSameDay = (a, b) => toYMD(new Date(a)) === toYMD(new Date(b))

// const isOverdue = (dateStr) => dateStr < today

// const friendlyDate = (dateStr) => {
//   if (dateStr === today) return 'Today'
//   const d = new Date(dateStr + 'T00:00:00')
//   return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
// }


// const MOCK_TASKS = [
//   { _id: '1', leadName: 'Nisha Jewellers',    task: 'Day 6 Final',     assignedTo: 'Divya M',   dueDate: today,                  priority: 'Urgent'    },
//   { _id: '2', leadName: 'Ravi Kumar Foods',   task: 'Day 2 Check-in',  assignedTo: 'Karthik R', dueDate: today,                  priority: 'Follow-up' },
//   { _id: '3', leadName: 'TechStart Solutions',task: 'Send Proposal',   assignedTo: 'Karthik R', dueDate: '2026-03-02',           priority: 'Task'      },
//   { _id: '4', leadName: 'Priya Electronics',  task: 'Qualify Call',    assignedTo: 'Arjun S',   dueDate: '2026-03-03',           priority: 'Task'      },
//   { _id: '5', leadName: "Meena's Bakery",     task: 'Day 4 Case Study',assignedTo: 'Divya M',   dueDate: '2026-03-04',           priority: 'Follow-up' },
// ]



// const PriorityDot = ({ priority, size = 8 }) => {
//   const c = PRIORITY_COLORS[priority] || PRIORITY_COLORS['Task']
//   return (
//     <span
//       style={{
//         display: 'inline-block',
//         width: size, height: size,
//         borderRadius: '50%',
//         background: c.dot,
//         flexShrink: 0,
//       }}
//     />
//   )
// }

// const TaskPill = ({ task, compact = false }) => {
//   const c = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS['Task']
//   if (compact) {
//     return (
//       <div style={{
//         background: c.bg,
//         border: `1px solid ${c.border}`,
//         borderRadius: 4,
//         padding: '1px 5px',
//         fontSize: 10,
//         color: c.text,
//         fontWeight: 500,
//         whiteSpace: 'nowrap',
//         overflow: 'hidden',
//         textOverflow: 'ellipsis',
//         maxWidth: '100%',
//         lineHeight: '16px',
//       }}>
//         {task.leadName}
//       </div>
//     )
//   }
//   return (
//     <div style={{
//       background: c.bg,
//       border: `1px solid ${c.border}`,
//       borderRadius: 10,
//       padding: '10px 14px',
//       marginBottom: 8,
//     }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
//         <span style={{
//           fontSize: 11,
//           fontWeight: 600,
//           color: isOverdue(task.dueDate) ? '#ef4444' : c.text,
//           letterSpacing: 0.2,
//         }}>
//           {isOverdue(task.dueDate) ? 'Today — Overdue' : friendlyDate(task.dueDate)}
//         </span>
//         <PriorityDot priority={task.priority} />
//       </div>
//       <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 2 }}>
//         {task.leadName}
//       </div>
//       <div style={{ fontSize: 12, color: '#6b7280' }}>
//         {task.task} · {task.assignedTo}
//       </div>
//     </div>
//   )
// }



// const DayModal = ({ date, tasks, onClose, onAddTask, saving }) => {
//   const [form, setForm] = useState({ task: '', assignedTo: '', priority: 'Task' })
//   const [showForm, setShowForm] = useState(false)

//   const dayTasks = tasks.filter(t => isSameDay(t.dueDate, date))
//   const label = `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (!form.task.trim()) return
//     onAddTask({ ...form, dueDate: toYMD(date) })
//     setForm({ task: '', assignedTo: '', priority: 'Task' })
//     setShowForm(false)
//   }

//   return (
//     <div
//       onClick={onClose}
//       style={{
//         position: 'fixed', inset: 0,
//         background: 'rgba(0,0,0,0.4)',
//         backdropFilter: 'blur(4px)',
//         zIndex: 100,
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//       }}
//     >
//       <div
//         onClick={e => e.stopPropagation()}
//         style={{
//           background: '#fff',
//           borderRadius: 16,
//           padding: 24,
//           width: '100%',
//           maxWidth: 420,
//           maxHeight: '80vh',
//           overflowY: 'auto',
//           boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
//         }}
//       >
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//           <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{label}</h3>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#6b7280' }}>✕</button>
//         </div>

//         {dayTasks.length === 0 && !showForm && (
//           <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>No tasks for this day.</p>
//         )}

//         {dayTasks.map(t => <TaskPill key={t._id} task={t} />)}

//         {showForm ? (
//           <form onSubmit={handleSubmit} style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
//             <input
//               required
//               placeholder="Task description"
//               value={form.task}
//               onChange={e => setForm(p => ({ ...p, task: e.target.value }))}
//               style={inputStyle}
//             />
//             <input
//               placeholder="Assigned to"
//               value={form.assignedTo}
//               onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}
//               style={inputStyle}
//             />
//             <select
//               value={form.priority}
//               onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
//               style={inputStyle}
//             >
//               {['Urgent', 'Task', 'Done', 'Follow-up'].map(p => <option key={p}>{p}</option>)}
//             </select>
//             <div style={{ display: 'flex', gap: 8 }}>
//               <button type="button" onClick={() => setShowForm(false)} style={cancelBtnStyle}>Cancel</button>
//               <button type="submit" disabled={saving} style={saveBtnStyle}>{saving ? 'Saving…' : 'Save Task'}</button>
//             </div>
//           </form>
//         ) : (
//           <button onClick={() => setShowForm(true)} style={addBtnStyle}>+ Add Task</button>
//         )}
//       </div>
//     </div>
//   )
// }

// const inputStyle = {
//   border: '1px solid #e5e7eb',
//   borderRadius: 8,
//   padding: '8px 12px',
//   fontSize: 13,
//   width: '100%',
//   outline: 'none',
//   boxSizing: 'border-box',
// }
// const saveBtnStyle = {
//   flex: 1, padding: '8px 0', background: '#2563eb', color: '#fff',
//   border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
// }
// const cancelBtnStyle = {
//   flex: 1, padding: '8px 0', background: '#f3f4f6', color: '#374151',
//   border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer',
// }
// const addBtnStyle = {
//   marginTop: 8, width: '100%', padding: '8px 0',
//   background: '#f0f9ff', color: '#2563eb',
//   border: '1px dashed #93c5fd', borderRadius: 8,
//   fontSize: 13, fontWeight: 600, cursor: 'pointer',
// }


// const Page = () => {
//   const router = useRouter()
//   const now = new Date()
//   const [currentYear, setCurrentYear]   = useState(now.getFullYear())
//   const [currentMonth, setCurrentMonth] = useState(now.getMonth())
//   const [tasks, setTasks]               = useState([])
//   const [loading, setLoading]           = useState(true)
//   const [saving, setSaving]             = useState(false)
//   const [selectedDate, setSelectedDate] = useState(null)
//   const [useMock, setUseMock]           = useState(false)


//   const fetchTasks = useCallback(async () => {
//     setLoading(true)
//     try {
//       const token = localStorage.getItem('token')
//       if (!token) { router.push('/login'); return }

//       const res = await axios.get('http://localhost:8080/tasks', {
//         headers: { 'auth-token': token },
//       })
     
//       const data = Array.isArray(res.data) ? res.data : (res.data.tasks || [])
//       setTasks(data)
//       setUseMock(false)
//     } catch (err) {
//       console.warn('API unavailable, using mock data:', err.message)
//       setTasks(MOCK_TASKS)
//       setUseMock(true)
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => { fetchTasks() }, [fetchTasks])


//   const handleAddTask = async ({ task, assignedTo, priority, dueDate }) => {
//     if (useMock) {
 
//       setTasks(prev => [...prev, {
//         _id: Date.now().toString(),
//         leadName: 'New Task',
//         task, assignedTo, priority, dueDate,
//       }])
//       setSelectedDate(null)
//       return
//     }
//     setSaving(true)
//     try {
//       const token = localStorage.getItem('token')
//       await axios.post('http://localhost:8080/tasks', { task, assignedTo, priority, dueDate }, {
//         headers: { 'auth-token': token },
//       })
//       await fetchTasks()
//       setSelectedDate(null)
//     } catch (err) {
//       alert('Failed to save task: ' + (err.response?.data?.message || err.message))
//     } finally {
//       setSaving(false)
//     }
//   }


//   const firstDay  = new Date(currentYear, currentMonth, 1).getDay()
//   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
//   const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
//     i < firstDay ? null : i - firstDay + 1
//   )

//   while (cells.length % 7 !== 0) cells.push(null)

//   const prevMonth = () => {
//     if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
//     else setCurrentMonth(m => m - 1)
//   }
//   const nextMonth = () => {
//     if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
//     else setCurrentMonth(m => m + 1)
//   }


//   const dayTasks = (day) => {
//     const ymd = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
//     return tasks.filter(t => isSameDay(t.dueDate, ymd))
//   }

  
//   const upcoming = [...tasks]
//     .filter(t => t.dueDate >= today)
//     .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
//     .slice(0, 8)

//   const overdueCount = tasks.filter(t => t.dueDate < today).length

//   const isToday = (day) =>
//     today === `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`

//   return (
//     <div style={{ display: 'flex', gap: 20, padding: 24, background: '#f1f5f9', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

   
//       <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>

        
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <button onClick={prevMonth} style={navBtn}>‹</button>
//             <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: 0 }}>
//               {MONTHS[currentMonth]} {currentYear}
//             </h2>
//             <button onClick={nextMonth} style={navBtn}>›</button>
//           </div>

         
//           <div style={{ display: 'flex', gap: 16 }}>
//             {['Urgent', 'Task', 'Done', 'Follow-up'].map(p => (
//               <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151' }}>
//                 <PriorityDot priority={p} />
//                 {p}
//               </span>
//             ))}
//           </div>
//         </div>

//         {useMock && (
//           <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#92400e', marginBottom: 12 }}>
//             ⚠ API unavailable — showing demo data
//           </div>
//         )}

      
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
//           {DAYS.map(d => (
//             <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#9ca3af', padding: '4px 0', letterSpacing: 0.5 }}>{d}</div>
//           ))}
//         </div>

      
//         {loading ? (
//           <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', fontSize: 14 }}>Loading…</div>
//         ) : (
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
//             {cells.map((day, idx) => {
//               const dt  = dayTasks(day)
//               const tod = isToday(day)
//               return (
//                 <div
//                   key={idx}
//                   onClick={() => day && setSelectedDate(new Date(currentYear, currentMonth, day))}
//                   style={{
//                     minHeight: 90,
//                     padding: '8px 6px',
//                     borderRight: (idx + 1) % 7 !== 0 ? '1px solid #f3f4f6' : 'none',
//                     borderBottom: idx < cells.length - 7 ? '1px solid #f3f4f6' : 'none',
//                     background: tod ? '#eff6ff' : '#fff',
//                     cursor: day ? 'pointer' : 'default',
//                     transition: 'background 0.15s',
//                     position: 'relative',
//                   }}
//                   onMouseEnter={e => { if (day) e.currentTarget.style.background = tod ? '#dbeafe' : '#f9fafb' }}
//                   onMouseLeave={e => { if (day) e.currentTarget.style.background = tod ? '#eff6ff' : '#fff' }}
//                 >
//                   {day && (
//                     <>
//                       <div style={{
//                         fontSize: 13,
//                         fontWeight: tod ? 700 : 400,
//                         color: tod ? '#2563eb' : '#374151',
//                         marginBottom: 4,
//                         width: 22, height: 22,
//                         borderRadius: '50%',
//                         background: tod ? '#2563eb' : 'transparent',
//                         color: tod ? '#fff' : '#374151',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         fontSize: 11,
//                       }}>{day}</div>

//                       <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                         {dt.slice(0, 2).map(t => <TaskPill key={t._id} task={t} compact />)}
//                         {dt.length > 2 && (
//                           <div style={{ fontSize: 10, color: '#6b7280', paddingLeft: 2 }}>+{dt.length - 2} more</div>
//                         )}
//                       </div>
//                     </>
//                   )}
//                 </div>
//               )
//             })}
//           </div>
//         )}
//       </div>

//       <div style={{ width: 320, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflowY: 'auto', maxHeight: 'calc(100vh - 48px)' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//           <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: 0 }}>Upcoming</h3>
//           {overdueCount > 0 && (
//             <span style={{ fontSize: 13, fontWeight: 600, color: '#ef4444' }}>{overdueCount} overdue</span>
//           )}
//         </div>

//         {loading ? (
//           <div style={{ fontSize: 13, color: '#9ca3af' }}>Loading…</div>
//         ) : upcoming.length === 0 ? (
//           <div style={{ fontSize: 13, color: '#9ca3af' }}>No upcoming tasks.</div>
//         ) : (
//           upcoming.map(t => <TaskPill key={t._id} task={t} />)
//         )}
//       </div>

//       {selectedDate && (
//         <DayModal
//           date={selectedDate}
//           tasks={tasks}
//           onClose={() => setSelectedDate(null)}
//           onAddTask={handleAddTask}
//           saving={saving}
//         />
//       )}
//     </div>
//   )
// }

// const navBtn = {
//   background: 'none',
//   border: '1px solid #e5e7eb',
//   borderRadius: 8,
//   width: 30, height: 30,
//   cursor: 'pointer',
//   fontSize: 16,
//   color: '#374151',
//   display: 'flex', alignItems: 'center', justifyContent: 'center',
//   lineHeight: 1,
// }

// export default Page