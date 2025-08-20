// src/App.tsx
import React from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Board } from './components/Board';

const App: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Board />
      </div>
    </div>
  );
};

export default App;


// import { useState } from 'react';
// import { AuthService } from './services/AuthService';
// import { useAuthStore } from './store/authStore';

// const authService = new AuthService();

// function App() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const user = useAuthStore((state) => state.user);

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await authService.login(email, password);
//       alert('Успешный вход!');
//     } catch (err) {
//       console.error(err);
//       alert('Ошибка входа');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     authService.logout();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         {user ? (
//           <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//             <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
//               <span className="text-white text-2xl font-bold">
//                 {user.name?.charAt(0).toUpperCase()}
//               </span>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-800 mb-2">
//               Добро пожаловать!
//             </h1>
//             <p className="text-gray-600 mb-6">
//               Привет, <span className="font-semibold text-blue-600">{user.email}</span>!
//             </p>
//             <button
//               onClick={handleLogout}
//               className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               Выйти из аккаунта
//             </button>
//           </div>
//         ) : (
//           <form 
//             onSubmit={handleLogin}
//             className="bg-white rounded-2xl shadow-xl p-8"
//           >
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                 Добро пожаловать
//               </h1>
//               <p className="text-gray-600">
//                 Введите свои данные для входа в систему
//               </p>
//             </div>

//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="your@email.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Пароль
//                 </label>
//                 <input
//                   type="password"
//                   placeholder="Введите пароль"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Вход...
//                   </div>
//                 ) : (
//                   'Войти в систему'
//                 )}
//               </button>
//             </div>

//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600">
//                 Нет аккаунта?{' '}
//                 <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
//                   Зарегистрироваться
//                 </a>
//               </p>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
