import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
            <h1 className="text-xl font-bold">My Board App</h1>
            <div className="flex gap-2">
            <button className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500">Добавить доску</button>
            <button className="px-3 py-1 bg-red-600 rounded hover:bg-red-500">Выход</button>
            </div>
        </header>
    );
};
